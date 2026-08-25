import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";

export function useSlider({
	slideCount,
	autoPlayInterval = 5500,
	pauseOnHover = true,
}: {
	slideCount: number;
	autoPlayInterval?: number;
	pauseOnHover?: boolean;
}) {
	const [rawActiveSlide, setActiveSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const touchStartX = useRef<number | null>(null);

	// Derive active index safely during render pass
	const activeSlide = slideCount > 0 ? rawActiveSlide % slideCount : 0;

	const goToNextSlide = useCallback(() => {
		setActiveSlide((current) => (current + 1) % (slideCount || 1));
	}, [slideCount]);

	const goToPreviousSlide = useCallback(() => {
		setActiveSlide((current) =>
			current === 0 ? (slideCount || 1) - 1 : current - 1,
		);
	}, [slideCount]);

	// Autoplay Effect
	useEffect(() => {
		if (isPaused || slideCount <= 1 || autoPlayInterval <= 0) return;

		const timer = window.setInterval(goToNextSlide, autoPlayInterval);
		return () => window.clearInterval(timer);
	}, [isPaused, slideCount, autoPlayInterval, goToNextSlide]);

	// Keyboard Navigation Effect — skip when user is in an input/textarea
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const tag = (e.target as HTMLElement)?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
			if (e.key === "ArrowLeft") goToPreviousSlide();
			if (e.key === "ArrowRight") goToNextSlide();
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [goToNextSlide, goToPreviousSlide]);

	// Touch Handlers
	const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
		if (e.touches[0]) touchStartX.current = e.touches[0].clientX;
	};

	const handleTouchEnd = (e: TouchEvent<HTMLElement>) => {
		if (!touchStartX.current || !e.changedTouches[0]) return;
		const touchEndX = e.changedTouches[0].clientX;
		const diffX = touchStartX.current - touchEndX;

		if (Math.abs(diffX) > 50) {
			if (diffX > 0) goToNextSlide();
			else goToPreviousSlide();
		}
		touchStartX.current = null;
	};

	const hoverHandlers = pauseOnHover
		? {
				onMouseEnter: () => setIsPaused(true),
				onMouseLeave: () => setIsPaused(false),
			}
		: {};

	return {
		activeSlide,
		setActiveSlide,
		goToNextSlide,
		goToPreviousSlide,
		touchHandlers: {
			onTouchStart: handleTouchStart,
			onTouchEnd: handleTouchEnd,
		},
		hoverHandlers,
	};
}
