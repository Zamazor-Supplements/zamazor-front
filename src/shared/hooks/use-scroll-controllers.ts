import { useState, useCallback, useEffect } from "react";

interface ScrollControlsOptions {
	/** Percentage of container width to scroll per click (0.1 to 1.0). Default: 0.75 */
	scrollRatio?: number;
}

export function useScrollControls<T extends HTMLElement = HTMLDivElement>({
	scrollRatio = 0.75,
}: ScrollControlsOptions = {}) {
	// Use a callback ref so React notifies us the exact moment the DOM node mounts/unmounts
	const [container, setContainer] = useState<T | null>(null);
	const sliderRef = useCallback((node: T | null) => {
		setContainer(node);
	}, []);

	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	const updateScrollButtons = useCallback(() => {
		if (!container) return;

		const { scrollLeft, scrollWidth, clientWidth } = container;

		if (scrollWidth <= clientWidth) {
			setCanScrollLeft(false);
			setCanScrollRight(false);
			return;
		}

		const isRtl = window.getComputedStyle(container).direction === "rtl";
		let normalizedScrollLeft = scrollLeft;

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
	}, [container]);

	useEffect(() => {
		if (!container) return;

		// Initial check (wrapped in rAF to ensure layout is painted)
		const frameId = requestAnimationFrame(() => {
			updateScrollButtons();
		});

		container.addEventListener("scroll", updateScrollButtons, {
			passive: true,
		});

		const resizeObserver = new ResizeObserver(() => updateScrollButtons());
		resizeObserver.observe(container);

		const mutationObserver = new MutationObserver(() => updateScrollButtons());
		mutationObserver.observe(container, {
			childList: true,
			subtree: true,
		});

		return () => {
			cancelAnimationFrame(frameId);
			container.removeEventListener("scroll", updateScrollButtons);
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, [container, updateScrollButtons]);

	const scroll = useCallback(
		(direction: "left" | "right") => {
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
		[container, scrollRatio],
	);

	return {
		sliderRef,
		canScrollLeft,
		canScrollRight,
		scroll,
		updateScrollButtons,
	};
}
