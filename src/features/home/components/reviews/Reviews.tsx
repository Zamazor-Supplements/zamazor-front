import { motion } from "framer-motion";
import { SectionHeading } from "../shared/SectionHeading";
import { StarIcon } from "lucide-react";
import { sectionLift } from "@/shared/config/motion";

interface Review {
	name: string;
	quote: string;
	meta: string;
}

interface CustomerReviewsProps {
	reviews: Review[];
}

export const CustomerReviews = ({ reviews }: CustomerReviewsProps) => {
	return (
		<motion.section
			variants={sectionLift}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.16 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			id="reviews"
			className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
		>
			<SectionHeading
				kicker="Customer love"
				title="Designed for people who want wellness to feel simple."
			/>

			<div className="mt-10 grid gap-6 md:grid-cols-3">
				{reviews.map((review) => (
					<motion.article
						key={review.name}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.35 }}
						transition={{ duration: 0.45 }}
						className="rounded-2xl border border-brand-900/10 bg-card p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
					>
						<div>
							<div
								className="flex gap-1 text-amber-400"
								aria-label="5 out of 5 stars"
							>
								{Array.from({ length: 5 }).map((_, index) => (
									<StarIcon
										key={index}
										className="size-4 fill-current"
										aria-hidden="true"
									/>
								))}
							</div>
							<p className="mt-4 text-base leading-relaxed text-ink-soft font-sans italic">
								"{review.quote}"
							</p>
						</div>
						<div className="mt-6 pt-4 border-t border-brand-100">
							<p className="font-bold text-ink text-sm">{review.name}</p>
							<p className="text-xs text-ink-soft font-medium">{review.meta}</p>
						</div>
					</motion.article>
				))}
			</div>
		</motion.section>
	);
};
