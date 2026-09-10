import { cn } from "@/lib/utils";
import { FAQ_CATEGORIES, type FAQCategory } from "../../config/categories";

interface FAQCategoryFilters {
	selectedCategory: FAQCategory;
	onChange: (c: FAQCategory) => void;
}

export const FAQCategoryFilters = ({
	selectedCategory,
	onChange,
}: FAQCategoryFilters) => {
	return (
		<div className="flex flex-wrap items-center gap-2">
			{FAQ_CATEGORIES.map((category) => {
				const isSelected = selectedCategory === category;
				return (
					<button
						key={category}
						type="button"
						onClick={() => onChange(category)}
						className={cn(
							"px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95",
							isSelected
								? "bg-brand-950 text-white shadow-md shadow-brand-950/15 ring-2 ring-brand-900/20"
								: "border border-slate-200/80 bg-slate-50/50 text-slate-600 hover:border-brand-900/30 hover:bg-brand-50/60 hover:text-brand-900",
						)}
					>
						{category}
					</button>
				);
			})}
		</div>
	);
};
