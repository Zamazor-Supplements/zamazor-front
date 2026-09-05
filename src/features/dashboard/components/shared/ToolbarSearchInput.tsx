import { useEffect, useRef, useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";

type ToolbarSearchInputProps = {
	/** Committed value; owned by the URL filters, not by this input. */
	value: string | undefined;
	/** Fired once typing settles, so keystrokes never touch URL or query state. */
	onCommit: (value: string | undefined) => void;
	placeholder?: string;
	delay?: number;
	className?: string;
};

export const ToolbarSearchInput = ({
	value,
	onCommit,
	placeholder = "Search...",
	delay = 500,
	className,
}: ToolbarSearchInputProps) => {
	const [draft, setDraft] = useState(value);
	const committed = useRef(value);
	const commit = useRef(onCommit);

	useEffect(() => {
		commit.current = onCommit;
	}, [onCommit]);

	// External writes (reset, back/forward) win over the local draft.
	useEffect(() => {
		if (value === committed.current) return;
		committed.current = value;
		setDraft(value);
	}, [value]);

	useEffect(() => {
		if (draft === committed.current) return;

		const timer = setTimeout(() => {
			committed.current = draft;
			commit.current(draft);
		}, delay);

		return () => clearTimeout(timer);
	}, [draft, delay]);

	const handleClear = () => {
		setDraft(undefined);
		committed.current = undefined;
		commit.current(undefined);
	};

	return (
		<div className={cn("relative min-w-50 flex-1 sm:max-w-xs", className)}>
			<SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
			<Input
				value={draft ?? ""}
				onChange={(event) => setDraft(event.target.value)}
				placeholder={placeholder}
				aria-label={placeholder}
				className="h-9.5 w-full rounded-lg border-brand-900/10 bg-surface-2/50 pl-9 pr-8 text-xs transition-colors placeholder:text-ink-faint focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-brand-600"
			/>
			{draft && (
				<button
					type="button"
					onClick={handleClear}
					aria-label="Clear search"
					className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-ink-faint hover:bg-brand-100 hover:text-ink"
				>
					<XIcon className="size-3.5" />
				</button>
			)}
		</div>
	);
};
