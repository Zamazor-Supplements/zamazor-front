import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

export const RECENTLY_VIEWED_LIMIT = 20;
export const RECENTLY_VIEWED_STORAGE_KEY = "zamazor-recently-viewed";

interface RecentlyViewedEntry {
	id: string;
	viewedAt: number;
}

interface RecentlyViewedStore {
	entries: RecentlyViewedEntry[];
	trackProduct: (id: string) => void;
}

/**
 * Persisted store of the last `RECENTLY_VIEWED_LIMIT` product ids a user
 * browsed, most recent first. Powers the homepage "Recently viewed" rail.
 * `trackProduct` dedupes (viewing an item again moves it to the front) and
 * caps the list so localStorage stays small.
 */
export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
	persist(
		(set) => ({
			entries: [] satisfies RecentlyViewedEntry[],
			trackProduct: (id) =>
				set((state) => {
					const withoutCurrent = state.entries.filter(
						(entry) => entry.id !== id,
					);
					return {
						entries: [{ id, viewedAt: Date.now() }, ...withoutCurrent].slice(
							0,
							RECENTLY_VIEWED_LIMIT,
						),
					};
				}),
		}),
		{
			name: RECENTLY_VIEWED_STORAGE_KEY,
			storage: createJSONStorage(() => localStorage),
		},
	),
);

/**
 * Ordered product ids, most recently viewed first. Components rendering the
 * rail subscribe through this selector and re-render only when the list
 * changes.
 *
 * `useShallow` is required: `.map(...)` returns a fresh array every call, so
 * without a shallow-equality check `useSyncExternalStore` would treat each
 * render as a state change and trigger an infinite re-render loop.
 */
export function useRecentlyViewedIds(): string[] {
	return useRecentlyViewedStore(
		useShallow((state) => state.entries.map((entry) => entry.id)),
	);
}
