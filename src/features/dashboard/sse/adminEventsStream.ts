import { queryClient } from "@/app/config/queryClient";
import CONFIG from "@/app/config/constants";
import { tokenManager } from "@/features/auth/globals/tokenManager";
import {
	ADMIN_EVENTS_ENDPOINT,
	invalidateQueriesForAdminEvent,
	resolveAdminEventName,
} from "./events";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const BASE_RETRY_DELAY_MS = 1_000;
const MAX_RETRY_DELAY_MS = 30_000;
/** ±20 % jitter avoids a herd of admins reconnecting in lockstep. */
const JITTER_RATIO = 0.2;

export type AdminEventsStatus = "connecting" | "open" | "closed";

type AdminEventsStatusListener = (status: AdminEventsStatus) => void;

/**
 * Ref-counted, module-level owner of the single admin EventSource.
 *
 * One shared connection for the whole authenticated admin area: every
 * `start()` acquires a lease but only the first opens the EventSource;
 * the connection is closed when the last `stop()` releases it (unmount,
 * logout, session expiry). StrictMode double-mounts therefore never create
 * duplicate connections.
 *
 * Native `EventSource` cannot set request headers, so the bearer token is
 * passed as the `access_token` query param (Spring Security resolves it
 * natively) and cookies stay on via `withCredentials`.
 */
class AdminEventsStream {
	private abortController: AbortController | null = null;
	private status: AdminEventsStatus = "closed";
	private leases = 0;
	private retryTimer: number | null = null;
	private connectTimer: number | null = null;
	private retryDelayMs = BASE_RETRY_DELAY_MS;
	private intentionallyClosed = false;
	private readonly listeners = new Set<AdminEventsStatusListener>();

	constructor() {
		if (typeof window === "undefined") {
			return;
		}

		document.addEventListener("visibilitychange", this.handleVisibilityChange);
		tokenManager.subscribe(this.handleTokenChange);
	}

	private get active(): boolean {
		return this.leases > 0 && !this.intentionallyClosed;
	}

	getStatus(): AdminEventsStatus {
		return this.status;
	}

	/**
	 * Acquire a lease on the shared connection. Safe to call from any number
	 * of mounted consumers — only the first lease opens the EventSource.
	 */
	start(): void {
		this.intentionallyClosed = false;
		this.leases += 1;
		this.scheduleConnect();
	}

	/** Release a lease; the connection closes when the last one is released. */
	stop(): void {
		this.leases = Math.max(0, this.leases - 1);
		if (this.leases === 0) {
			this.close();
		}
	}

	subscribe(listener: AdminEventsStatusListener): () => void {
		this.listeners.add(listener);
		listener(this.getStatus());
		return () => {
			this.listeners.delete(listener);
		};
	}

	private scheduleConnect = (): void => {
		if (this.connectTimer !== null) return;

		this.connectTimer = window.setTimeout(() => {
			this.connectTimer = null;
			this.connect();
		}, 0);
	};

	private connect = (): void => {
		if (!this.active || this.abortController || this.retryTimer !== null)
			return;

		const token = tokenManager.getAccessToken();
		if (!token) return;

		const url = new URL(ADMIN_EVENTS_ENDPOINT, CONFIG.API_BASE_URL);
		const controller = new AbortController();
		this.abortController = controller;

		this.emit("connecting");

		fetchEventSource(url.toString(), {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			signal: controller.signal,
			onopen: async (response) => {
				if (response.ok) {
					this.retryDelayMs = BASE_RETRY_DELAY_MS;
					this.updateStatus("open");
					return;
				}
				if (response.status >= 400 && response.status < 500) {
					// Client-side error (e.g., unauthorized token), stop retrying
					this.intentionallyClosed = true;
					this.close();
					throw new Error(`Client error: ${response.status}`);
				}
				throw new Error(`Server error: ${response.status}`);
			},
			onmessage: (event) => {
				const eventName = event.event === "" ? null : event.event;
				this.handleEvent(eventName, event.data);
			},
			onerror: (err) => {
				// Throwing error stops auto-reconnect if we want manual backoff control,
				// or let it retry based on your existing scheduler logic.
				throw err;
			},
		}).catch(() => {
			if (!this.intentionallyClosed) {
				this.scheduleReconnect();
			}
		});
	};

	private handleEvent = (eventName: string | null, raw: string): void => {
		const resolved = resolveAdminEventName(eventName, raw);
		if (!resolved) return;

		void invalidateQueriesForAdminEvent(queryClient, resolved);
	};

	private scheduleReconnect = (): void => {
		this.cleanupConnection();
		this.updateStatus("closed");

		// Nothing to back off for when the consumer released the stream, the
		// tab is hidden, or a reconnect attempt is already scheduled.
		if (!this.active || document.hidden || this.retryTimer !== null) return;

		const jitter = 1 + (Math.random() - 0.5) * 2 * JITTER_RATIO;
		const delayMs = Math.min(this.retryDelayMs * jitter, MAX_RETRY_DELAY_MS);

		this.retryTimer = window.setTimeout(() => {
			this.retryTimer = null;
			this.retryDelayMs = Math.min(this.retryDelayMs * 2, MAX_RETRY_DELAY_MS);
			this.connect();
		}, delayMs);
	};

	private cleanupConnection = (): void => {
		if (this.connectTimer !== null) {
			window.clearTimeout(this.connectTimer);
			this.connectTimer = null;
		}
		if (this.abortController) {
			this.abortController.abort();
			this.abortController = null;
		}
		if (this.retryTimer !== null) {
			window.clearTimeout(this.retryTimer);
			this.retryTimer = null;
		}
	};

	private close = (): void => {
		this.cleanupConnection();
		this.updateStatus("closed");
	};

	private handleTokenChange = (token: string | null): void => {
		if (!token) {
			this.intentionallyClosed = true;
			this.close();
			return;
		}

		if (!this.active) return;

		// Reset backoff on valid token rotation/acquisition
		this.retryDelayMs = BASE_RETRY_DELAY_MS;
		this.cleanupConnection();
		this.connect();
	};

	private handleVisibilityChange = (): void => {
		if (document.hidden || !this.active) return;
		if (!this.abortController && this.retryTimer === null) {
			this.connect();
		}
	};

	private updateStatus = (status: AdminEventsStatus): void => {
		this.status = status;
		this.emit(status);
	};

	private emit = (status: AdminEventsStatus): void => {
		this.listeners.forEach((listener) => listener(status));
	};
}

/** Singleton shared by every admin consumer. */
export const adminEventsStream = new AdminEventsStream();
