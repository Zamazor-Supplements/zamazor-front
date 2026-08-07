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
			{FAQ_CATEGORIES.map((category) => (
				<button
					key={category}
					onClick={() => onChange(category)}
					className={cn(
						"px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer",
						selectedCategory === category
							? "bg-emerald-950 text-white shadow-md shadow-emerald-950/10"
							: "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-900",
					)}
				>
					{category}
				</button>
			))}
		</div>
	);
};
