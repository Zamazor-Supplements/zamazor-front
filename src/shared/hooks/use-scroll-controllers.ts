import {
	useRef,
	useState,
	useCallback,
	useEffect,
	type DependencyList,
} from "react";

interface ScrollControlsOptions {
	/** Percentage of container width to scroll per click (0.1 to 1.0). Default: 0.75 */
	scrollRatio?: number;
	deps?: DependencyList;
}

export function useScrollControls<T extends HTMLElement = HTMLDivElement>({
	scrollRatio = 0.75,
	deps = [],
}: ScrollControlsOptions = {}) {
	const sliderRef = useRef<T>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	const updateScrollButtons = useCallback(() => {
		const container = sliderRef.current;
		if (!container) return;

		const { scrollLeft, scrollWidth, clientWidth } = container;

		// Content fits without scrolling
		if (scrollWidth <= clientWidth) {
			setCanScrollLeft(false);
			setCanScrollRight(false);
			return;
		}

		const isRtl = window.getComputedStyle(container).direction === "rtl";
		let normalizedScrollLeft = scrollLeft;

		// Normalize RTL scroll values across browsers
		if (isRtl) {
			const maxScroll = scrollWidth - clientWidth;
			if (scrollLeft < 0) {
				normalizedScrollLeft = Math.abs(scrollLeft);
			} else if (scrollLeft > 0 && scrollLeft <= maxScroll) {
				normalizedScrollLeft = maxScroll - scrollLeft;
			}
		}

		const maxScrollLeft = scrollWidth - clientWidth;
		const tolerance = 4;

		setCanScrollLeft(normalizedScrollLeft > tolerance);
		setCanScrollRight(normalizedScrollLeft < maxScrollLeft - tolerance);
	}, []);

	useEffect(() => {
		const container = sliderRef.current;
		if (!container) return;

		// Initial check
		updateScrollButtons();

		// 1. Listen for user scrolling
		container.addEventListener("scroll", updateScrollButtons, {
			passive: true,
		});

		// 2. Observe container size or viewport changes
		const resizeObserver = new ResizeObserver(() => updateScrollButtons());
		resizeObserver.observe(container);

		// 3. Observe DOM changes (cards added/removed, async content rendered)
		const mutationObserver = new MutationObserver(() => updateScrollButtons());
		mutationObserver.observe(container, {
			childList: true, // Catches new/removed product cards
			subtree: true, // Catches changes inside cards (e.g. dynamic images)
		});

		return () => {
			container.removeEventListener("scroll", updateScrollButtons);
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [updateScrollButtons, ...deps]);

	const scroll = useCallback(
		(direction: "left" | "right") => {
			const container = sliderRef.current;
			if (!container) return;

			const isRtl = window.getComputedStyle(container).direction === "rtl";
			const scrollAmount = container.clientWidth * scrollRatio;

			let multiplier = direction === "right" ? 1 : -1;
			if (isRtl) multiplier *= -1;

			container.scrollBy({
				left: scrollAmount * multiplier,
				behavior: "smooth",
			});
		},
		[scrollRatio],
	);

	return {
		sliderRef,
		canScrollLeft,
		canScrollRight,
		scroll,
		updateScrollButtons,
	};
}
