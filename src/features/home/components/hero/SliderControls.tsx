import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface SliderControlsProps {
	totalSlides: number;
	activeSlide: number;
	onPrev: () => void;
	onNext: () => void;
	onSelect: (index: number) => void;
}

export const SliderControls = ({
	totalSlides,
	activeSlide,
	onPrev,
	onNext,
	onSelect,
}: SliderControlsProps) => {
	if (totalSlides <= 1) return null;

	return (
		<div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-25 flex items-center gap-4 rounded-full border border-white/10 bg-brand-950/45 px-5 py-2.5 shadow-2xl backdrop-blur-md">
			<Button
				type="button"
				variant="ghost"
				size="icon"
				aria-label="Previous slide"
				className="size-9 rounded-full text-white hover:bg-white/20 hover:text-white"
				onClick={onPrev}
			>
				<ChevronLeftIcon className="size-5" />
			</Button>

			<div className="flex gap-2">
				{Array.from({ length: totalSlides }).map((_, index) => (
					<button
						key={index}
						type="button"
						aria-label={`Show slide ${index + 1}`}
						onClick={() => onSelect(index)}
						className={cn(
							"h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent",
							index === activeSlide
								? "w-8 bg-accent"
								: "w-2.5 bg-white/40 hover:bg-white/70",
						)}
					/>
				))}
			</div>

			<Button
				type="button"
				variant="ghost"
				size="icon"
				aria-label="Next slide"
				className="size-9 rounded-full text-white hover:bg-white/20 hover:text-white"
				onClick={onNext}
			>
				<ChevronRightIcon className="size-5" />
			</Button>
		</div>
	);
};
