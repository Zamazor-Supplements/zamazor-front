import { cn } from "@/lib/utils";
import { ChevronDownIcon, HelpCircleIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { FAQ_ITEMS } from "../../config/faqs";
import type { FAQCategory } from "../../config/categories";

interface FAQAccordionsProps {
	query: string;
	selectedCategory: FAQCategory;
	resetFilters: () => void;
}

export const FAQAccordions = ({
	query,
	selectedCategory,
	resetFilters,
}: FAQAccordionsProps) => {
	const [openFaqId, setOpenFaqId] = useState<string | null>("choose-product");
	// Filter FAQs based on Search + Category
	const filteredFaqs = useMemo(() => {
		return FAQ_ITEMS.filter((faq) => {
			const matchesCategory =
				selectedCategory === "All" || faq.category === selectedCategory;
			const matchesSearch =
				faq.question.toLowerCase().includes(query.toLowerCase()) ||
				faq.answer.toLowerCase().includes(query.toLowerCase());

			return matchesCategory && matchesSearch;
		});
	}, [query, selectedCategory]);

	return (
		<div className="mt-8 space-y-4">
			{filteredFaqs.length === 0 ? (
				<div className="py-12 text-center">
					<div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
						<HelpCircleIcon className="size-6" />
					</div>
					<h3 className="mt-4 text-base font-semibold text-slate-900">
						No matching questions found
					</h3>
					<p className="mt-1 text-sm text-slate-500">
						Try adjusting your search terms or category filter.
					</p>
					<button
						onClick={resetFilters}
						className="mt-4 text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
					>
						Reset all filters
					</button>
				</div>
			) : (
				filteredFaqs.map((faq) => {
					const isOpen = openFaqId === faq.id;
					return (
						<div
							key={faq.id}
							className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-200"
						>
							<button
								onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
								className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-900 hover:bg-slate-50/80 transition-colors cursor-pointer"
								aria-expanded={isOpen}
							>
								<span className="text-base sm:text-lg font-playfair font-normal">
									{faq.question}
								</span>
								<ChevronDownIcon
									className={cn(
										"size-5 shrink-0 text-emerald-800 transition-transform duration-200",
										isOpen && "rotate-180",
									)}
								/>
							</button>

							{isOpen && (
								<div className="px-5 pb-5 text-sm sm:text-base leading-relaxed text-slate-600 border-t border-slate-100 pt-4 bg-slate-50/30">
									{faq.answer}
								</div>
							)}
						</div>
					);
				})
			)}
		</div>
	);
};
