import { useAddToCart } from "@/features/cart/services/mutations";
import { useNavigate } from "react-router";
import { useQuizState } from "../../hooks/use-quiz-state";
import { XIcon } from "lucide-react";
import { QuizStepRenderer } from "./QuizStepRenderer";
import { useCallback } from "react";
import type { Product } from "@/features/products/schemas/productSchema";

interface SupplementQuizProps {
	onClose: () => void;
}

export const SupplementQuiz = ({ onClose }: SupplementQuizProps) => {
	const navigate = useNavigate();
	const addToCartMutation = useAddToCart();

	const {
		quizStep,
		setQuizStep,
		quizFocus,
		setQuizFocus,
		quizDiet,
		setQuizDiet,
		setQuizActivity,
		recommended,
		backdropRef,
		handleBackdropClick,
		resetQuiz,
	} = useQuizState(onClose);

	const handleAddToCart = useCallback(
		(product: Product) => {
			addToCartMutation.mutate({ product, quantity: 1 });
		},
		[addToCartMutation],
	);

	const handleNavigate = useCallback(
		(path: string) => {
			navigate(path);
			onClose();
		},
		[navigate, onClose],
	);

	return (
		<div
			ref={backdropRef}
			onClick={handleBackdropClick}
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-labelledby="quiz-modal-title"
		>
			<div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-linear-to-br from-emerald-50/95 to-lime-50/60 border border-emerald-900/10 rounded-3xl shadow-2xl p-6 sm:p-10">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 size-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm z-10"
					aria-label="Close quiz"
				>
					<XIcon className="size-4" />
				</button>

				{/* Modal Header */}
				<div className="text-center mb-8">
					<span className="text-xs font-black uppercase tracking-widest text-emerald-800">
						Smart Supplement Finder
					</span>
					<h2
						id="quiz-modal-title"
						className="mt-2 text-2xl font-playfair font-normal text-slate-950"
					>
						Discover your personalized organic stack.
					</h2>
					<p className="mt-2 text-sm text-slate-500">
						30-second science-backed quiz
					</p>
				</div>

				{/* Step Views Container */}
				<div role="region" aria-live="polite">
					<QuizStepRenderer
						quizStep={quizStep}
						setQuizStep={setQuizStep}
						quizFocus={quizFocus}
						setQuizFocus={setQuizFocus}
						quizDiet={quizDiet}
						setQuizDiet={setQuizDiet}
						setQuizActivity={setQuizActivity}
						recommended={recommended}
						resetQuiz={resetQuiz}
						onAddToCart={handleAddToCart}
						onNavigate={handleNavigate}
					/>
				</div>
			</div>
		</div>
	);
};
