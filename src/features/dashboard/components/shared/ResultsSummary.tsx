import { SlidersHorizontalIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ResultsSummaryProps = {
	totalElements: number;
	/** Singular noun, e.g. "order" or "product". */
	itemLabel: string;
	className?: string;
};

export const ResultsSummary = ({
	totalElements,
	itemLabel,
	className,
}: ResultsSummaryProps) => {
	const pluralLabel = `${itemLabel}s`;

	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-soft",
				className,
			)}
		>
			<SlidersHorizontalIcon className="size-3.5 text-ink-faint" />
			{totalElements === 0 ? (
				<span className="text-ink-faint">No {pluralLabel} found</span>
			) : (
				<span>
					<strong className="font-semibold text-ink">{totalElements}</strong>{" "}
					{totalElements === 1 ? itemLabel : pluralLabel}
				</span>
			)}
		</span>
	);
};
