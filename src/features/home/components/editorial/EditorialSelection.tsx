import heroProtein from "@/assets/images/hero_protein.png";
import heroGreens from "@/assets/images/hero_greens.png";
import heroRecovery from "@/assets/images/hero_recovery.png";

import { sectionLift } from "@/shared/config/motion";
import { SectionHeading } from "../shared/SectionHeading";
import { motion } from "framer-motion";
import { useProducts } from "@/features/products/services/product/queries";
import { useMemo } from "react";
import { FEATURE_CHECKLIST } from "../../config/featureChecklist";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router";
import { APP_ROUTES } from "@/app/routes/paths";
import { EditorialCard } from "./EditorialCard";

export const EditorialSelection = () => {
	const { data: productPage } = useProducts();

	const routineHighlights = useMemo(() => {
		const items = productPage?.items ?? [];

		const pick = (categoryKey: string) =>
			items.find((product) =>
				product?.category?.label
					?.toLowerCase()
					.includes(categoryKey.toLowerCase()),
			);

		const cards = [
			{
				id: "greens",
				title: "Mornings that feel lighter.",
				copy: "Micronutrients, hydration, and a cleaner first hour.",
				product: pick("Greens"),
				image: pick("Greens")?.imageUrl || heroGreens,
				tone: "bg-lime-100 text-lime-800",
			},
			{
				id: "protein",
				title: "Protein with a calm finish.",
				copy: "A simple daily protein card for strength and consistency.",
				product: pick("Protein"),
				image: pick("Protein")?.imageUrl || heroProtein,
				tone: "bg-brand-100 text-brand-800",
			},
			{
				id: "recovery",
				title: "Recovery after the work is done.",
				copy: "Evening support that feels soft, focused, and easy to repeat.",
				product: pick("Recovery"),
				image: pick("Recovery")?.imageUrl || heroRecovery,
				tone: "bg-teal-100 text-teal-800",
			},
		];

		// Energy has no dedicated fallback asset, so only render its card when
		// an actual Energy product exists — otherwise it would borrow the Greens
		// image and show a misleading duplicate card.
		const energy = pick("Energy");
		if (energy) {
			cards.push({
				id: "energy",
				title: "Energy without the noise.",
				copy: "A cleaner way to stay switched on for the day ahead.",
				product: energy,
				image: energy.imageUrl,
				tone: "bg-amber-100 text-amber-800",
			});
		}

		return cards;
	}, [productPage]);

	return (
		<motion.section
			variants={sectionLift}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.16 }}
			transition={{ duration: 0.58, ease: "easeOut" }}
			className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
		>
			<div className="grid gap-8 overflow-hidden rounded-xl border border-brand-900/10 bg-card p-5 shadow-xl shadow-brand-950/5 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
				{/* Sticky Editorial Overview Column */}
				<div className="lg:sticky lg:top-28 lg:self-start">
					<SectionHeading
						kicker="Editorial selection"
						title="A more guided shelf for faster shopping."
						copy="This section puts the most shoppable routines front and center with clearer hierarchy and more visual cards."
					/>

					<div className="mt-8 space-y-3">
						{FEATURE_CHECKLIST.map((item) => (
							<div
								key={item}
								className="flex items-center gap-3 rounded-lg border border-brand-900/10 bg-brand-50/50 px-4 py-3 text-sm font-semibold text-ink-soft"
							>
								<CheckIcon className="size-4 shrink-0 text-brand-700" />
								<span>{item}</span>
							</div>
						))}
					</div>

					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<Button
							asChild
							className="h-11 rounded-lg bg-brand-900 text-white hover:bg-brand-950"
						>
							<Link to={APP_ROUTES.SHOP}>
								Browse the shop
								<ArrowRightIcon className="ml-2 size-4" />
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="h-11 rounded-lg border-brand-900/10 text-brand-800 hover:bg-brand-50"
						>
							<Link to={APP_ROUTES.SHOP}>Browse products</Link>
						</Button>
					</div>
				</div>

				{/* Highlights Cards Grid */}
				<div className="grid gap-4 sm:grid-cols-2">
					{routineHighlights.map((item, index) => (
						<EditorialCard key={item.id} item={item} index={index} />
					))}
				</div>
			</div>
		</motion.section>
	);
};
