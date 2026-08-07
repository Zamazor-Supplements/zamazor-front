import type { Product } from "@/features/products/schemas/productSchema";
import type { QuizFocus } from "../../types/quiz";
import { Button } from "@/shared/components/ui/button";
import { formatCurrency } from "@/shared/utils/price";
import { ShoppingBagIcon } from "lucide-react";
import { APP_ROUTES } from "@/app/routes/paths";

export const QuizResults = ({
	recommended,
	quizFocus,
	onAddToCart,
	onNavigate,
	onReset,
}: {
	recommended: Product | undefined;
	quizFocus: QuizFocus;
	onAddToCart: (product: Product) => void;
	onNavigate: (path: string) => void;
	onReset: () => void;
}) => {
	if (!recommended) {
		return (
			<div className="text-center py-10">
				<p className="text-slate-500 text-sm">
					No products loaded yet. Please try again shortly.
				</p>
				<Button
					variant="ghost"
					onClick={onReset}
					className="mt-4 cursor-pointer"
				>
					Retake Quiz
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
					Your Recommendation
				</span>
				<h3 className="text-xl font-playfair text-slate-950 font-normal mt-1">
					Here is your personalized clean formula match:
				</h3>
			</div>
			<div className="flex flex-col md:flex-row gap-6 p-4 sm:p-6 bg-white rounded-2xl border border-emerald-900/10 shadow-md">
				<div className="size-28 sm:size-36 shrink-0 bg-slate-50 border border-slate-100 rounded-xl p-2 flex items-center justify-center mx-auto md:mx-0">
					<img
						src={recommended.imageUrl}
						alt={recommended.name}
						className="h-full object-contain"
					/>
				</div>
				<div className="flex-1 text-center md:text-left flex flex-col justify-between">
					<div>
						<span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider bg-emerald-50 border border-emerald-900/5 px-2.5 py-0.5 rounded-full inline-block">
							{recommended.category.label}
						</span>
						<h4 className="text-xl font-playfair font-bold text-slate-950 mt-1.5">
							{recommended.name}
						</h4>
						<p className="text-xs text-slate-500 mt-2 leading-relaxed">
							Based on your wellness goals for{" "}
							<strong className="text-emerald-950">{quizFocus}</strong> and
							active schedule, this premium clean formula delivers bioavailable
							nourishment with zero synthetics.
						</p>
					</div>
					<div className="mt-4 flex items-center justify-between flex-wrap gap-2 border-t border-slate-100 pt-3">
						<span className="text-lg font-black text-slate-900">
							{formatCurrency(recommended.price)}
						</span>
						<div className="flex gap-2 w-full sm:w-auto">
							<Button
								onClick={() => onAddToCart(recommended)}
								className="flex-1 sm:flex-initial h-10 px-5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
							>
								<ShoppingBagIcon className="size-3.5" />
								Add to Cart
							</Button>
							<Button
								variant="outline"
								onClick={() => onNavigate(APP_ROUTES.PRODUCT(recommended.id))}
								className="h-10 px-4 rounded-xl border-emerald-900/15 text-emerald-800 hover:bg-emerald-50 cursor-pointer"
							>
								Details
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-end pt-2">
				<Button
					variant="ghost"
					onClick={onReset}
					className="text-slate-500 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-bold uppercase tracking-wider"
				>
					Retake Quiz
				</Button>
			</div>
		</div>
	);
};
