import { AlertTriangleIcon } from "lucide-react";
import type { Category } from "../../schemas/categorySchema";
import { cn } from "@/lib/utils";
import { useCategories } from "../../services/category/queries";
import { useMemo } from "react";

const SKELETON_WIDTHS = [85, 110, 95, 120, 80, 105];

interface CategoryTabsProps {
	activeCategoryId: string | undefined;
	setActiveCategoryId: (id: string | undefined) => void;
}
export const CategoryTabs = ({
	activeCategoryId,
	setActiveCategoryId,
}: CategoryTabsProps) => {
	const { data: categories, isPending, isError, refetch } = useCategories();

	const categoryTabs = useMemo(() => {
		return [{ id: undefined, label: "All" } as const, ...(categories ?? [])];
	}, [categories]);

	return (
		<div className="mb-8">
			{isPending ? (
				<div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none [scrollbar-width:none]">
					{SKELETON_WIDTHS.map((width, idx) => (
						<CategoryTabSkeleton key={idx} width={width} />
					))}
				</div>
			) : isError ? (
				<CategoryTabsErrorFallback onRetry={() => refetch()} />
			) : (
				<div
					role="tablist"
					aria-label="Shop by Category"
					className="flex overflow-x-auto gap-2.5 pb-4 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] snap-x"
				>
					{categoryTabs.map((category) => (
						<CategoryTab
							key={category.label}
							category={category}
							activeCategoryId={activeCategoryId}
							setActiveCategoryId={setActiveCategoryId}
						/>
					))}
				</div>
			)}
		</div>
	);
};

const CategoryTabSkeleton = ({ width }: { width: number }) => {
	return (
		<div
			className="h-9 rounded-full bg-brand-900/5 animate-pulse shrink-0"
			style={{ width: `${width}px` }}
		/>
	);
};

const CategoryTabsErrorFallback = ({ onRetry }: { onRetry: () => void }) => {
	return (
		<div className="flex overflow-x-auto gap-2.5 pb-4 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
			<div className="inline-flex items-center justify-between gap-3 px-5 py-2 text-xs font-medium rounded-full border border-amber-200/80 bg-amber-50/80 text-amber-900 shrink-0 shadow-xs">
				<span className="flex items-center gap-2">
					<AlertTriangleIcon className="size-3.5 text-amber-600 shrink-0" />
					Failed to load categories
				</span>
				<button
					type="button"
					onClick={onRetry}
					className="font-bold underline underline-offset-2 text-amber-950 hover:text-brand-950 transition-colors cursor-pointer ml-2"
				>
					Retry
				</button>
			</div>
		</div>
	);
};

interface CategoryTabProps {
	category: Category | { id: undefined; label: "All" };
	activeCategoryId: string | undefined;
	setActiveCategoryId: (id: string | undefined) => void;
}
const CategoryTab = ({
	category,
	activeCategoryId,
	setActiveCategoryId,
}: CategoryTabProps) => {
	const isActive = activeCategoryId === category.id;

	return (
		<button
			key={category.id ?? "All"}
			role="tab"
			aria-selected={isActive}
			onClick={() => setActiveCategoryId(category.id)}
			className={cn(
				"px-5 py-2 text-xs font-bold rounded-full border transition-all duration-200 cursor-pointer snap-start shrink-0 shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-800/20",
				isActive
					? "bg-brand-950 text-white border-brand-950 shadow-md shadow-brand-950/10"
					: "bg-white text-brand-800 border-brand-900/10 hover:bg-brand-50 hover:text-brand-950 hover:-translate-y-0.5",
			)}
		>
			{category.label}
		</button>
	);
};
