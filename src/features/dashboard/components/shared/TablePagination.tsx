import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type TablePaginationProps = {
	page: number;
	size: number;
	totalPages: number;
	totalElements: number;
	/** Plural noun, e.g. "orders" or "products". */
	itemLabel: string;
	disabled?: boolean;
	onPageChange: (page: number) => void;
};

export const TablePagination = ({
	page,
	size,
	totalPages,
	totalElements,
	itemLabel,
	disabled = false,
	onPageChange,
}: TablePaginationProps) => {
	if (totalElements === 0) return null;

	const start = page * size + 1;
	const end = Math.min((page + 1) * size, totalElements);

	return (
		<div className="flex select-none flex-col items-center justify-between gap-3 border-t border-brand-900/10 bg-surface-2/50 px-6 py-3 sm:flex-row">
			<p className="text-xs font-medium text-ink-soft">
				Showing <span className="font-semibold text-ink">{start}</span>–
				<span className="font-semibold text-ink">{end}</span> of{" "}
				<span className="font-semibold text-ink">{totalElements}</span> {itemLabel}
			</p>

			{totalPages > 1 && (
				<div className="flex items-center gap-1.5">
					<Button
						variant="outline"
						size="icon"
						disabled={page === 0 || disabled}
						onClick={() => onPageChange(page - 1)}
						title="Previous page"
						className="h-8 w-8 rounded-lg border-brand-900/10 text-ink-soft hover:bg-surface-2 disabled:opacity-40"
					>
						<ChevronLeftIcon className="size-4" />
					</Button>

					<span className="px-2 text-xs font-semibold text-ink">
						Page {page + 1} of {totalPages}
					</span>

					<Button
						variant="outline"
						size="icon"
						disabled={page >= totalPages - 1 || disabled}
						onClick={() => onPageChange(page + 1)}
						title="Next page"
						className="h-8 w-8 rounded-lg border-brand-900/10 text-ink-soft hover:bg-surface-2 disabled:opacity-40"
					>
						<ChevronRightIcon className="size-4" />
					</Button>
				</div>
			)}
		</div>
	);
};
