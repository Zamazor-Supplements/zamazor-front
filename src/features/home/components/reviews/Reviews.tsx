import { motion } from "framer-motion";
import { SectionHeading } from "../shared/SectionHeading";
import { StarIcon } from "lucide-react";

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
		<section
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
						className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
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
							<p className="mt-4 text-base leading-relaxed text-slate-700 font-sans italic">
								"{review.quote}"
							</p>
						</div>
						<div className="mt-6 pt-4 border-t border-slate-100">
							<p className="font-bold text-slate-950 text-sm">{review.name}</p>
							<p className="text-xs text-slate-500 font-medium">
								{review.meta}
							</p>
						</div>
					</motion.article>
				))}
			</div>
		</section>
	);
};
