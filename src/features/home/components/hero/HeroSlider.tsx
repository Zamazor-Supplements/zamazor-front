import { cn } from "@/lib/utils";
import type { Slide } from "../../config/slides";
import { useSlider } from "../../hooks/use-slider";
import { AnimatePresence, motion } from "framer-motion";
import {
	backgroundVariants,
	childVariants,
	contentContainerVariants,
} from "../../config/motion";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router";
import { useLanguage } from "@/shared/hooks/use-language";
import {
	ArrowRightIcon,
	BadgeCheckIcon,
	FlaskConicalIcon,
	LeafIcon,
} from "lucide-react";
import { SliderControls } from "./SliderControls";

const TRUST_STRIP = [
	{ icon: FlaskConicalIcon, labelKey: "hero.trustLabTested" },
	{ icon: BadgeCheckIcon, labelKey: "hero.trustGmp" },
	{ icon: LeafIcon, labelKey: "hero.trustNatural" },
] as const;

interface HeroSliderProps {
	slides: Slide[];
	autoPlayInterval?: number;
	pauseOnHover?: boolean;
	className?: string;
	overlayClassName?: string;
	documentTitle?: string;
}

export const HeroSlider = ({
	slides = [],
	autoPlayInterval = 5500,
	pauseOnHover = true,
	className,
	overlayClassName,
}: HeroSliderProps) => {
	const {
		activeSlide,
		setActiveSlide,
		goToNextSlide,
		goToPreviousSlide,
		touchHandlers,
		hoverHandlers,
	} = useSlider({
		slideCount: slides.length,
		autoPlayInterval,
		pauseOnHover,
	});

	const { t } = useLanguage();
	const slide = slides[activeSlide];
	if (!slide) return null;

	return (
		<section
			className={cn(
				"relative w-full h-screen min-h-150 overflow-hidden border-b border-brand-900/10 bg-brand-950",
				className,
			)}
			style={{
				marginTop: `calc(-1 * var(--header-height, 80px))`,
				transform: "translateY(-2px)",
			}}
			{...hoverHandlers}
			{...touchHandlers}
		>
			{/* Background Image Carousel */}
			<AnimatePresence mode="wait">
				<motion.div
					key={slide.id ?? activeSlide}
					variants={backgroundVariants}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={{ duration: 0.45, ease: "easeInOut" }}
					className="absolute inset-0 bg-cover bg-center"
					style={{ backgroundImage: `url(${slide.image})` }}
				>
					{/* Dark Gradient Overlay */}
					<div
						className={cn(
							"absolute inset-0 bg-linear-to-r from-brand-950/90 via-brand-950/65 to-transparent max-md:bg-brand-950/80",
							overlayClassName,
						)}
					/>
				</motion.div>
			</AnimatePresence>

			{/* Floating Content Layer */}
			<div className="absolute inset-0 flex items-center pt-12 sm:pt-16 lg:pt-20">
				<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="max-w-2xl relative z-10">
						<AnimatePresence mode="wait">
							<motion.div
								key={slide.id ?? activeSlide}
								variants={contentContainerVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
							>
								{/* Kicker / Badge */}
								{slide.badge && (
									<motion.div
										variants={childVariants}
										className="mb-5 inline-flex w-fit items-center gap-2 rounded-lg border border-accent/25 bg-brand-950/55 px-3.5 py-1.5 text-sm font-bold text-accent shadow-sm backdrop-blur-sm"
									>
										{slide.accent && (
											<span
												className={cn("size-2 rounded-full", slide.accent)}
											/>
										)}
										{slide.badge}
									</motion.div>
								)}

								{/* Title */}
								<motion.h1
									variants={childVariants}
									className="text-4xl font-playfair font-normal leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
								>
									{slide.title}
								</motion.h1>

								{/* Description */}
								<motion.p
									variants={childVariants}
									className="mt-6 text-base sm:text-lg leading-relaxed text-brand-50/85"
								>
									{slide.description}
								</motion.p>

								{/* Actions */}
								{(slide.primaryAction || slide.secondaryAction) && (
									<motion.div
										variants={childVariants}
										className="mt-8 flex flex-col gap-3.5 sm:flex-row"
									>
										{slide.primaryAction && (
											<Button
												asChild
												size="lg"
												className="h-12 bg-accent text-brand-950 font-extrabold px-6 hover:bg-accent/85 shadow-lg shadow-lime-500/20"
											>
												<Link to={slide.primaryAction.href}>
													{slide.primaryAction.label}
													{slide.primaryAction.icon ?? (
														<ArrowRightIcon className="ml-2 size-4" />
													)}
												</Link>
											</Button>
										)}

										{slide.secondaryAction && (
											<Button
												asChild
												variant="outline"
												size="lg"
												className="h-12 border-white/20 bg-white/10 text-white font-extrabold px-6 hover:bg-white/20 hover:text-white backdrop-blur-sm"
											>
												<Link to={slide.secondaryAction.href}>
													{slide.secondaryAction.label}
												</Link>
											</Button>
										)}
									</motion.div>
								)}

								{/* Trust Strip */}
								<motion.div
									variants={childVariants}
									className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2.5"
								>
									{TRUST_STRIP.map(({ icon: Icon, labelKey }) => (
										<span
											key={labelKey}
											className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-accent backdrop-blur-sm"
										>
											<Icon className="size-3.5" />
											{t(labelKey)}
										</span>
									))}
								</motion.div>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>

			{/* Controls & Indicators */}
			<SliderControls
				totalSlides={slides.length}
				activeSlide={activeSlide}
				onPrev={goToPreviousSlide}
				onNext={goToNextSlide}
				onSelect={setActiveSlide}
			/>
		</section>
	);
};
