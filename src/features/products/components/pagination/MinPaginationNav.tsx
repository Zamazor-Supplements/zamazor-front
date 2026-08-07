import type { Dispatch, SetStateAction } from "react";
import type { Paginations } from "../../types/filters";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface MiniPaginationNavProps {
	paginations: Paginations;
	setPaginations: Dispatch<SetStateAction<Paginations>>;
	totalPages: number;
}

export const MiniPaginationNav = ({
	paginations,
	setPaginations,
	totalPages,
}: MiniPaginationNavProps) => {
	if (totalPages <= 1) return null;

	const isFirstPage = paginations.page <= 0;
	const isLastPage = paginations.page >= totalPages - 1;

	const handlePrev = () => {
		setPaginations((prev) => ({
			...prev,
			page: Math.max(0, prev.page - 1),
		}));
	};

	const handleNext = () => {
		setPaginations((prev) => ({
			...prev,
			page: Math.min(totalPages - 1, prev.page + 1),
		}));
	};

	return (
		<nav
			aria-label="Compact pagination"
			className="flex h-10 select-none items-center gap-1.5 rounded-xl border border-emerald-900/10 bg-white px-2.5 py-1 shadow-xs"
		>
			<button
				type="button"
				disabled={isFirstPage}
				onClick={handlePrev}
				aria-label="Previous page"
				title="Previous page"
				className="cursor-pointer p-1 text-emerald-800 transition-colors hover:text-emerald-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-800/20 rounded-md disabled:cursor-not-allowed disabled:opacity-30"
			>
				<ChevronLeftIcon className="size-4" />
			</button>

			<span className="px-1 text-xs font-bold text-slate-600">
				{paginations.page + 1}/{totalPages}
			</span>

			<button
				type="button"
				disabled={isLastPage}
				onClick={handleNext}
				aria-label="Next page"
				title="Next page"
				className="cursor-pointer p-1 text-emerald-800 transition-colors hover:text-emerald-950 focus:outline-hidden focus:ring-2 focus:ring-emerald-800/20 rounded-md disabled:cursor-not-allowed disabled:opacity-30"
			>
				<ChevronRightIcon className="size-4" />
			</button>
		</nav>
	);
};
