import type { ProductPage } from "@/features/products/schemas/productSchema";
import { formatCurrency } from "../utils/price";

interface SuggestionsDropdownProps {
	suggestions: ProductPage | undefined;
	isLoading: boolean;
	searchQuery?: string;
	onSelectProduct: (productId: string) => void;
}

export const SearchSuggestionsList = ({
	suggestions,
	isLoading,
	searchQuery,
	onSelectProduct,
}: SuggestionsDropdownProps) => {
	if (isLoading || !suggestions) {
		return (
			<div className="flex items-center justify-center gap-2 p-4 text-center text-xs text-slate-500">
				<div className="size-4 animate-spin rounded-full border-2 border-emerald-800 border-t-transparent" />
				Searching formulas...
			</div>
		);
	}

	if (suggestions.items.length === 0) {
		return (
			<div className="p-4 text-center text-xs text-slate-400">
				No formulas match "{searchQuery}"
			</div>
		);
	}

	return (
		<div className="space-y-1 p-2">
			<p className="border-b border-emerald-900/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-900/40">
				Suggested Products
			</p>
			{suggestions.items.map((product) => (
				<div
					key={product.id}
					onClick={() => onSelectProduct(product.id)}
					className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-emerald-50/50"
				>
					<div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-emerald-900/5 bg-slate-50 p-1.5">
						<img
							src={product.imageUrl}
							alt={product.name}
							className="h-full w-full object-contain"
						/>
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate text-xs font-bold leading-tight text-slate-900">
							{product.name}
						</p>
						<p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
							{product.category?.label}
						</p>
					</div>
					<div className="text-right">
						<p className="text-xs font-black text-slate-950">
							{formatCurrency(product.price)}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};
