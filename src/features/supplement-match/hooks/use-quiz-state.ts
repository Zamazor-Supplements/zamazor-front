import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { QuizFocus, QuizStep } from "../types/quiz";
import { useProducts } from "@/features/products/services/product/queries";
import { getRecommendProduct } from "../utils/getRecommendedProduct";

export const useQuizState = (onClose?: () => void) => {
	const [quizStep, setQuizStep] = useState<QuizStep>("intro");
	const [quizFocus, setQuizFocus] = useState<QuizFocus>("");
	const [quizDiet, setQuizDiet] = useState<string>("vegan");
	const [quizActivity, setQuizActivity] = useState<string>("");
	const backdropRef = useRef<HTMLDivElement>(null);

	const { data: productPage } = useProducts();

	// Handle ESC Key to close modal
	useEffect(() => {
		if (!onClose) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	// Lock body scroll safely while modal/hook is mounted
	useEffect(() => {
		if (!onClose) return;
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, [onClose]);

	const recommended = useMemo(() => {
		const items = productPage?.items ?? [];
		return getRecommendProduct(items, {
			focus: quizFocus,
			diet: quizDiet,
			activity: quizActivity,
		});
	}, [productPage?.items, quizFocus, quizDiet, quizActivity]);

	const resetQuiz = useCallback(() => {
		setQuizStep("intro");
		setQuizFocus("");
		setQuizDiet("vegan");
		setQuizActivity("");
	}, []);

	const handleBackdropClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (e.target === backdropRef.current) onClose?.();
		},
		[onClose],
	);

	return {
		quizStep,
		setQuizStep,
		quizFocus,
		setQuizFocus,
		quizDiet,
		setQuizDiet,
		quizActivity,
		setQuizActivity,
		recommended,
		backdropRef,
		handleBackdropClick,
		resetQuiz,
	};
};
