import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { Paginations } from "../../types/filters";
import type { Dispatch, SetStateAction } from "react";

interface PaginationControllersProps {
	paginations: Paginations;
	setPaginations: Dispatch<SetStateAction<Paginations>>;
	totalPages: number;
}

export const PaginationControllers = ({
	paginations,
	setPaginations,
	totalPages,
}: PaginationControllersProps) => {
	if (totalPages <= 1) return null;

	const isFirstPage = paginations.page === 0;
	const isLastPage = paginations.page >= totalPages - 1;

	const goToPage = (pageIndex: number) => {
		setPaginations((prev) => ({
			...prev,
			page: Math.max(0, Math.min(totalPages - 1, pageIndex)),
		}));
	};

	return (
		<nav
			aria-label="Pagination navigation"
			className="mt-10 flex items-center justify-center gap-2 border-t border-brand-900/5 pt-6 select-none"
		>
			{/* Previous Button */}
			<Button
				variant="outline"
				size="icon"
				disabled={isFirstPage}
				onClick={() => goToPage(paginations.page - 1)}
				aria-label="Go to previous page"
				className="h-9 w-9 cursor-pointer rounded-lg border-brand-900/10 text-brand-800 transition-colors hover:bg-brand-50 hover:text-brand-900 disabled:cursor-not-allowed disabled:opacity-40"
			>
				<ChevronLeftIcon className="size-4" />
			</Button>

			{/* Page Numbers */}
			{Array.from({ length: totalPages }).map((_, i) => {
				const isCurrentPage = paginations.page === i;
				return (
					<Button
						key={i}
						variant={isCurrentPage ? "default" : "outline"}
						onClick={() => goToPage(i)}
						aria-label={`Go to page ${i + 1}`}
						aria-current={isCurrentPage ? "page" : undefined}
						className={cn(
							"h-9 w-9 cursor-pointer rounded-lg text-xs font-bold transition-all",
							isCurrentPage
								? "border-brand-900 bg-brand-900 text-white shadow-sm hover:bg-brand-950"
								: "border-brand-900/10 text-brand-800 hover:bg-brand-50 hover:text-brand-900",
						)}
					>
						{i + 1}
					</Button>
				);
			})}

			{/* Next Button */}
			<Button
				variant="outline"
				size="icon"
				disabled={isLastPage}
				onClick={() => goToPage(paginations.page + 1)}
				aria-label="Go to next page"
				className="h-9 w-9 cursor-pointer rounded-lg border-brand-900/10 text-brand-800 transition-colors hover:bg-brand-50 hover:text-brand-900 disabled:cursor-not-allowed disabled:opacity-40"
			>
				<ChevronRightIcon className="size-4" />
			</Button>
		</nav>
	);
};
