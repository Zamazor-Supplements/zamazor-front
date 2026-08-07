import CONFIG from "@/app/config/constants";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import { motion } from "framer-motion";
import {
	BadgeCheckIcon,
	BatteryChargingIcon,
	DumbbellIcon,
	LeafIcon,
	MoonIcon,
	PackageCheckIcon,
	TruckIcon,
} from "lucide-react";

import { ProductsSlider } from "@/features/products/components/slider/ProductsSlider";
import { CategorySlider } from "@/features/products/components/category/CategorySlider";
import { sectionLift } from "@/app/config/motion";
import { HERO_SLIDES } from "@/features/home/config/slides";
import { HeroSlider } from "@/features/home/components/hero/HeroSlider";
import { SupplementFinder } from "@/features/supplement-match/components/shared/SupplementFinder";
import { useCategories } from "@/features/products/services/category/queries";
import { CategoryMarquee } from "@/features/home/components/categories/CategoryMarqee";
import { FormulationsGrid } from "@/features/home/components/formulations/FormulationsGrid";
import { ProofSection } from "@/features/home/components/proof/ProofSection";
import { ComparisonTable } from "@/features/home/components/comparison/ComparisonTable";
import { DailyStackTimeline } from "../components/timeline/DailyStackTimeLine";
import { CustomerReviews } from "@/features/home/components/reviews/Reviews";
import { TrustBadges } from "@/features/home/components/trust/TrustBadges";
import { EditorialSelection } from "@/features/home/components/editorial/EditorialSelection";

const STACK_STEPS = [
	{
		time: "08:00 AM",
		moment: "MORNING START",
		title: "Wake up clean",
		copy: "Daily Greens and Hydra Charge help your morning start with active minerals, digestive enzymes, and steady focus.",
		products: ["Daily Greens", "Hydra Charge"],
		icon: BatteryChargingIcon,
		color: "bg-emerald-500 text-white shadow-emerald-500/20",
	},
	{
		time: "02:00 PM",
		moment: "TRAINING & FOCUS",
		title: "Train with intent",
		copy: "Protein blends and performance BCAAs support muscle synthesis, stamina, and recovery on training days.",
		products: ["GreenFuel Protein", "Pre-Workout Spark"],
		icon: DumbbellIcon,
		color: "bg-amber-500 text-white shadow-amber-500/20",
	},
	{
		time: "09:30 PM",
		moment: "REST & REPAIR",
		title: "Rebuild at night",
		copy: "Slow-release recovery formulas and soothing minerals support deeper sleep cycles and natural cellular repair.",
		products: ["Night Repair", "Muscle Restore BCAAs"],
		icon: MoonIcon,
		color: "bg-indigo-600 text-white shadow-indigo-600/20",
	},
];

const REVIEWS = [
	{
		quote:
			"The greens taste fresh, not grassy. It is the first supplement habit I have actually kept.",
		name: "Maya R.",
		meta: "Daily Greens subscriber",
	},
	{
		quote:
			"Protein mixes smooth and does not feel heavy. Perfect after morning training.",
		name: "Adam K.",
		meta: "GreenFuel Protein",
	},
	{
		quote:
			"The recovery stack made my evenings more consistent. Simple, clean, and easy to trust.",
		name: "Nadia S.",
		meta: "Recovery bundle",
	},
];

const TRUST_ITEMS = [
	{
		label: "Lab-tested batches",
		icon: BadgeCheckIcon,
	},
	{
		label: "No artificial colors",
		icon: LeafIcon,
	},
	{
		label: "Fast delivery",
		icon: TruckIcon,
	},
	{
		label: "Easy subscriptions",
		icon: PackageCheckIcon,
	},
];

const PROOF_STATS = [
	{
		value: "92%",
		label: "customers felt more consistent after 30 days",
	},
	{
		value: "18g",
		label: "protein per serving in our daily blend",
	},
	{
		value: "0g",
		label: "added sugar in hydration and greens",
	},
	{
		value: "3rd",
		label: "party tested for quality and purity",
	},
];

const COMPARISON_DATA = [
	{
		feature: "Transparent ingredient list",
		zamazor: {
			text: "100% full disclosure",
			type: "success",
		},
		typical: {
			text: "Often hidden in proprietary blends",
			type: "fail",
		},
	},
	{
		feature: "Routine guidance",
		zamazor: {
			text: "Personalized stacks by goal",
			type: "success",
		},
		typical: {
			text: "Product-only shopping",
			type: "fail",
		},
	},
	{
		feature: "Subscription flexibility",
		zamazor: {
			text: "Skip, pause, or edit in 30 seconds",
			type: "success",
		},
		typical: {
			text: "Rigid, hard-to-cancel cycles",
			type: "fail",
		},
	},
	{
		feature: "Artificial colors & sweeteners",
		zamazor: {
			text: "Never used (zero artificiels)",
			type: "success",
		},
		typical: {
			text: "Commonly added for flavor/color",
			type: "fail",
		},
	},
	{
		feature: "Third-party lab checks",
		zamazor: {
			text: "Every batch tested + public reports",
			type: "success",
		},
		typical: {
			text: "Rarely done or private",
			type: "fail",
		},
	},
];

export const HomePage = () => {
	const { data: categories } = useCategories();

	useDocumentTitle(`Clean Supplements | ${CONFIG.APP_NAME}`);

	return (
		<>
			<HeroSlider slides={HERO_SLIDES} />
			<CategoryMarquee categories={categories} />
			<SupplementFinder />
			<ProductsSlider />
			<FormulationsGrid />
			<CategorySlider />
			<EditorialSelection />

			{/* Proof & Evidence Section */}
			<motion.div
				id="proof"
				variants={sectionLift}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.2 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<ProofSection stats={PROOF_STATS} />
			</motion.div>

			{/* Feature Comparison */}
			<motion.div
				variants={sectionLift}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.18 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<ComparisonTable data={COMPARISON_DATA} />
			</motion.div>

			{/* Daily Routine Timeline */}
			<motion.div
				variants={sectionLift}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.14 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<DailyStackTimeline steps={STACK_STEPS} />
			</motion.div>

			{/* Customer Testimonials */}
			<motion.div
				variants={sectionLift}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.16 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<CustomerReviews reviews={REVIEWS} />
			</motion.div>

			<motion.div
				variants={sectionLift}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.16 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<TrustBadges items={TRUST_ITEMS} />
			</motion.div>
		</>
	);
};
