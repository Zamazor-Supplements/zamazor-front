import { cn } from "@/lib/utils";
import { QuizStepRenderer } from "../quiz/QuizStepRenderer";
import { useCallback } from "react";
import { useQuizState } from "../../hooks/use-quiz-state";
import { useNavigate } from "react-router";
import { useAddToCart } from "@/features/cart/services/mutations";
import type { Product } from "@/features/products/schemas/productSchema";

interface SupplementAdvisorProps {
	className?: string;
}

export const SupplementRecommendation = ({
	className,
}: SupplementAdvisorProps) => {
	const navigate = useNavigate();
	const addItemMutation = useAddToCart();

	const {
		quizStep,
		setQuizStep,
		quizFocus,
		setQuizFocus,
		quizDiet,
		setQuizDiet,
		setQuizActivity,
		recommended,
		resetQuiz,
	} = useQuizState();

	const handleAddToCart = useCallback(
		(product: Product, quantity = 1) => {
			addItemMutation.mutate({ product, quantity });
		},
		[addItemMutation],
	);

	return (
		<div
			className={cn(
				"bg-linear-to-br from-brand-50/50 to-lime-50/20 border border-brand-900/10 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden text-left min-h-105 flex flex-col justify-between",
				className,
			)}
		>
			<div role="region" aria-live="polite" className="w-full my-auto">
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
					onNavigate={navigate}
				/>
			</div>
		</div>
	);
};
