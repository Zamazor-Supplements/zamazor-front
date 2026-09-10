import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "../shared/SectionHeading";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import CONFIG from "@/app/config/constants";
import { sectionLift } from "@/shared/config/motion";

type StackStep = {
	title: string;
	copy: string;
	icon: LucideIcon;
	time: string;
	moment: string;
	products: string[];
	color: string;
};

interface DailyStackTimelineProps {
	steps: StackStep[];
}
export const DailyStackTimeline = ({ steps }: DailyStackTimelineProps) => {
	return (
		<motion.section
			variants={sectionLift}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.14 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			id="stack"
			className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-brand-900/10"
		>
			<div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
				{/* Sticky Info Panel */}
				<div className="lg:sticky lg:top-28">
					<SectionHeading
						kicker="Daily stack"
						title="A better routine is easier when the steps are obvious."
						copy={`${CONFIG.APP_NAME} stacks are designed around the moments that matter most: morning energy, focused training, and real recovery at night.`}
					/>
					<div className="mt-8 rounded-2xl bg-brand-50/60 border border-brand-900/10 p-6">
						<h4 className="font-playfair text-lg font-bold text-brand-950">
							Why Stacking Works
						</h4>
						<p className="mt-2 text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
							Taking vitamins at random times reduces absorption and creates
							habit friction. By grouping complementary nutrients into fixed
							morning, training, and evening windows, you build consistency and
							amplify efficacy.
						</p>
					</div>
				</div>

				{/* Timeline Path */}
				<div className="relative pl-6 sm:pl-8">
					<div className="absolute left-5.75 sm:left-7.75 top-4 bottom-4 w-0.5 bg-brand-900/10 border-dashed border-l" />

					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.15 }}
						transition={{ staggerChildren: 0.12 }}
						className="space-y-8"
					>
						{steps.map(
							(
								{ title, copy, icon: Icon, time, moment, products, color },
								index,
							) => (
								<motion.div
									key={title}
									variants={{
										hidden: { opacity: 0, y: 20 },
										visible: { opacity: 1, y: 0 },
									}}
									className="relative group flex gap-6 rounded-2xl border border-brand-900/10 bg-card p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-brand-900/20 transition-all duration-200"
								>
									{/* Timeline Bullet Node */}
									<div className="absolute -left-9.5 sm:-left-11.75 top-6 z-10 flex size-8 sm:size-10 items-center justify-center rounded-full bg-card border border-brand-900/15 shadow-xs group-hover:border-brand-700 transition-colors">
										<span
											className={cn(
												"flex size-6 sm:size-8 items-center justify-center rounded-full text-xs font-bold",
												color,
											)}
										>
											<Icon className="size-3.5 sm:size-4" />
										</span>
									</div>

									<div className="flex-1">
										<div className="flex flex-wrap items-center justify-between gap-2">
											<span className="text-[10px] font-black uppercase tracking-wider text-brand-800 bg-brand-50 px-2.5 py-0.5 rounded-md">
												Step {index + 1} • {moment}
											</span>
											<span className="text-xs font-bold text-ink-soft font-mono">
												{time}
											</span>
										</div>

										<h3 className="mt-3 text-lg sm:text-xl font-playfair font-bold text-ink">
											{title}
										</h3>
										<p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-soft font-sans">
											{copy}
										</p>

										<div className="mt-4 flex flex-wrap gap-1.5 items-center">
											<span className="text-[10px] font-bold text-ink-faint uppercase tracking-wider mr-1">
												Recommended:
											</span>
											{products.map((prod) => (
												<span
													key={prod}
													className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-950 border border-brand-200/60 hover:border-brand-900/20 hover:bg-brand-50/50 transition-colors cursor-pointer"
												>
													{prod}
												</span>
											))}
										</div>
									</div>
								</motion.div>
							),
						)}
					</motion.div>
				</div>
			</div>
		</motion.section>
	);
};
