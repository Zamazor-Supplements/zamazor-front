import type { Product } from "@/features/products/schemas/productSchema";
import { QuizActivityStep } from "./QuizActivityStep";
import { QuizDietStep } from "./QuizDietStep";
import { QuizIntroStep } from "./QuizIntroStep";
import { QuizResults } from "../results/QuizResults";
import { QuizFocusStep } from "./QuizFocusStep";
import type { QuizFocus, QuizStep } from "../../types/quiz";

interface QuizStepRendererProps {
	quizStep: QuizStep;
	setQuizStep: (step: QuizStep) => void;
	quizFocus: QuizFocus;
	setQuizFocus: (focus: QuizFocus) => void;
	quizDiet: string;
	setQuizDiet: (diet: string) => void;
	setQuizActivity: (activity: string) => void;
	recommended: Product | undefined;
	resetQuiz: () => void;
	onAddToCart: (product: Product, quantity?: number) => void;
	onNavigate: (path: string) => void;
}

export const QuizStepRenderer = ({
	quizStep,
	setQuizStep,
	quizFocus,
	setQuizFocus,
	quizDiet,
	setQuizDiet,
	setQuizActivity,
	recommended,
	resetQuiz,
	onAddToCart,
	onNavigate,
}: QuizStepRendererProps) => {
	switch (quizStep) {
		case "intro":
			return <QuizIntroStep onStart={() => setQuizStep("focus")} />;
		case "focus":
			return (
				<QuizFocusStep
					onSelect={(focus) => {
						setQuizFocus(focus);
						setQuizStep("diet");
					}}
				/>
			);
		case "diet":
			return (
				<QuizDietStep
					selectedDiet={quizDiet}
					onSelect={(diet) => {
						setQuizDiet(diet);
						setQuizStep("activity");
					}}
					onBack={() => setQuizStep("focus")}
				/>
			);
		case "activity":
			return (
				<QuizActivityStep
					onSelect={(activity) => {
						setQuizActivity(activity);
						setQuizStep("result");
					}}
					onBack={() => setQuizStep("diet")}
				/>
			);
		case "result":
			return (
				<QuizResults
					recommended={recommended}
					quizFocus={quizFocus}
					onAddToCart={onAddToCart}
					onNavigate={onNavigate}
					onReset={resetQuiz}
				/>
			);
		default:
			return null;
	}
};
