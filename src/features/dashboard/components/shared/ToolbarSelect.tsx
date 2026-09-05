import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToolbarSelectOption<T extends string | undefined> = {
	value: T;
	label: string;
};

type ToolbarSelectProps<T extends string> = {
	value: T;
	options: readonly ToolbarSelectOption<T>[];
	onChange: (value: T) => void;
	ariaLabel: string;
	className?: string;
};

export function ToolbarSelect<T extends string>({
	value,
	options,
	onChange,
	ariaLabel,
	className,
}: ToolbarSelectProps<T>) {
	return (
		<div className={cn("relative min-w-35", className)}>
			<select
				value={value}
				aria-label={ariaLabel}
				onChange={(event) => onChange(event.target.value as T)}
				className="h-9.5 w-full appearance-none rounded-lg border border-brand-900/10 bg-surface-2/50 pl-3 pr-8 text-xs font-medium text-ink transition-colors hover:bg-brand-100/70 focus:bg-card focus:outline-none focus:ring-2 focus:ring-brand-600"
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-faint" />
		</div>
	);
}
