import { HelpCircleIcon, SparklesIcon } from "lucide-react";
import { useMemo } from "react";
import { FAQ_ITEMS } from "../../config/faqs";
import type { FAQCategory } from "../../config/categories";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { cn } from "@/lib/utils";

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
		<div className="mt-8">
			{filteredFaqs.length === 0 ? (
				<div className="relative overflow-hidden flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/30 backdrop-blur-xl py-16 px-6 text-center shadow-inner animate-in fade-in-50 duration-300">
					<div className="absolute inset-0 bg-linear-to-b from-brand-50/20 via-transparent to-transparent pointer-events-none" />
					<div className="relative mx-auto flex size-16 items-center justify-center rounded-xl bg-white text-brand-800 shadow-md ring-1 ring-brand-900/5">
						<HelpCircleIcon className="size-7 stroke-[1.75]" />
					</div>
					<h3 className="relative mt-5 text-lg font-bold tracking-tight text-slate-900">
						No matching questions found
					</h3>
					<p className="relative mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">
						We couldn't find anything matching your search. Try checking your
						spelling or resetting your filters.
					</p>
					<button
						type="button"
						onClick={resetFilters}
						className="relative mt-6 inline-flex items-center justify-center rounded-lg bg-brand-950 px-6 py-3 text-xs font-bold text-white shadow-md shadow-brand-950/10 transition-all duration-200 hover:bg-brand-900 hover:shadow-lg active:scale-95 cursor-pointer"
					>
						Reset all filters
					</button>
				</div>
			) : (
				<Accordion className="space-y-4">
					{filteredFaqs.map((faq) => (
						<AccordionItem
							key={faq.id}
							value={faq.id}
							className={cn(
								"group overflow-hidden rounded-xl border border-slate-200/70 bg-white",
								"shadow-sm shadow-slate-950/5 transition-all duration-300 ease-out",
								"hover:border-slate-300 hover:shadow-md hover:shadow-slate-950/10",
								"data-[state=open]:border-brand-800/30 data-[state=open]:shadow-xl data-[state=open]:shadow-brand-950/10 data-[state=open]:ring-4 data-[state=open]:ring-brand-900/5",
							)}
						>
							<AccordionTrigger
								className={cn(
									"flex w-full items-center justify-between p-6 text-left text-slate-900",
									"transition-colors hover:no-underline hover:bg-slate-50/60 cursor-pointer",
									"[&>svg]:text-brand-800 [&>svg]:size-5 [&>svg]:transition-transform [&>svg]:duration-300",
								)}
							>
								<div className="flex items-center gap-4 pr-4">
									<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-all duration-300 group-data-[state=open]:bg-brand-50 group-data-[state=open]:text-brand-900 group-data-[state=open]:scale-105 shadow-xs">
										<SparklesIcon className="size-4 opacity-75 group-data-[state=open]:opacity-100" />
									</div>
									<span className="text-base sm:text-lg font-playfair font-normal tracking-tight text-slate-900 transition-all">
										{faq.question}
									</span>
								</div>
							</AccordionTrigger>
							<AccordionContent className="px-6 pb-6 pt-1 text-sm sm:text-base leading-relaxed text-slate-600 bg-linear-to-b from-slate-50/50 to-white border-t border-slate-100/80">
								<div className="pl-4 sm:pl-12 border-l-2 border-brand-800/40 my-3">
									{faq.answer}
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			)}
		</div>
	);
};
