import CONFIG from "@/app/config/constants";
import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import {
	SparklesIcon,
	ShieldCheckIcon,
	TrophyIcon,
	HeartHandshakeIcon,
	TruckIcon,
	CheckCircle2Icon,
	ArrowRightIcon,
	FlameIcon,
} from "lucide-react";
import { Link } from "react-router";

// --- Data ---

const MILESTONES = [
	{
		year: "2021",
		title: "The Vision Began",
		description:
			"Founded with a clear mission: to eliminate counterfeit supplements in Morocco by providing 100% lab-certified, premium sports nutrition.",
	},
	{
		year: "2023",
		title: "Nationwide Logistics",
		description:
			"Expanded fulfillment operations to offer 24-48 hour express delivery and Cash on Delivery across all major Moroccan provinces.",
	},
	{
		year: "2025",
		title: "Gym & Athlete Network",
		description:
			"Partnered with over 50 premier fitness centers and professional athletes, establishing elite nutrition standards nationwide.",
	},
	{
		year: "2026",
		title: "The Modern Era",
		description:
			"Empowering tens of thousands of fitness enthusiasts daily with pure ingredients, transparent labeling, and direct support.",
	},
];

const CORE_VALUES = [
	{
		icon: ShieldCheckIcon,
		title: "100% Authenticity Guaranteed",
		description:
			"Every product is sourced directly from certified manufacturers with full batch verification and laboratory testing.",
	},
	{
		icon: TrophyIcon,
		title: "Uncompromised Quality",
		description:
			"We strictly stock formulas that meet global purity benchmarks—free from banned substances or hidden filler blends.",
	},
	{
		icon: HeartHandshakeIcon,
		title: "Athlete-Centric Support",
		description:
			"Our team consists of fitness experts ready to guide you on dosage, timing, and stacking for your specific physical goals.",
	},
	{
		icon: TruckIcon,
		title: "Reliable Morocco Shipping",
		description:
			"Fast, seamless shipping with flexible Cash on Delivery options so you get your nutrition exactly when you need it.",
	},
];

const STATS = [
	{ value: "50K+", label: "Orders Delivered" },
	{ value: "100%", label: "Lab Tested" },
	{ value: "150+", label: "Gym Partners" },
	{ value: "4.9/5", label: "Customer Rating" },
];

// --- Main Story Page Component ---

export const StoryPage = () => {
	useDocumentTitle(`Our Story & Heritage | ${CONFIG.APP_NAME}`);

	return (
		<div className="min-h-screen bg-[#fcfdfa] py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100">
			<div className="mx-auto max-w-7xl space-y-16">
				{/* --- Hero Section --- */}
				<div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-900/10 bg-linear-to-br from-emerald-950 via-emerald-900 to-slate-950 p-8 sm:p-16 text-white shadow-xl shadow-emerald-950/10">
					<div className="relative z-10 max-w-3xl space-y-4">
						<div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-lime-300 backdrop-blur-md">
							<SparklesIcon className="size-3.5" />
							<span>Built for Moroccan Athletes</span>
						</div>

						<h1 className="text-3xl sm:text-5xl font-playfair font-normal leading-tight">
							Fueling Human Potential Through Pure Nutrition
						</h1>

						<p className="text-sm sm:text-base leading-relaxed text-emerald-100/80 pt-2">
							ZAMAZOR was born out of a simple necessity: athletes and fitness
							enthusiasts in Morocco deserved uncompromising quality, complete
							formula transparency, and guaranteed authentic supplements.
						</p>
					</div>

					{/* Ambient Glow Decorative Background */}
					<div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
				</div>

				{/* --- Stat Highlights --- */}
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{STATS.map((stat) => (
						<div
							key={stat.label}
							className="rounded-3xl border border-emerald-900/10 bg-white p-6 sm:p-8 text-center shadow-xs"
						>
							<p className="font-playfair text-3xl sm:text-4xl font-black text-emerald-950">
								{stat.value}
							</p>
							<p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500">
								{stat.label}
							</p>
						</div>
					))}
				</div>

				{/* --- Mission & Vision Split Section --- */}
				<div className="grid gap-8 lg:grid-cols-2 items-center">
					<div className="space-y-6">
						<div>
							<p className="text-xs font-black uppercase tracking-wider text-emerald-800">
								Our Purpose
							</p>
							<h2 className="text-3xl sm:text-4xl font-playfair font-normal text-slate-950 mt-1">
								Raising the Standard of Sports Nutrition
							</h2>
						</div>

						<p className="text-xs sm:text-sm leading-relaxed text-slate-600">
							For years, the local fitness community faced inconsistent product
							authenticity, delayed deliveries, and inflated pricing. We set out
							to redefine the standard by creating a direct link between
							world-class labs and Moroccan gym-goers.
						</p>

						<ul className="space-y-3">
							{[
								"Strict sourcing protocols with direct manufacturer certificates",
								"Formulas backed by clinical dosages and clean ingredients",
								"Dedicated customer service built by fitness professionals",
							].map((point, idx) => (
								<li
									key={idx}
									className="flex items-start gap-3 text-xs sm:text-sm text-slate-800"
								>
									<CheckCircle2Icon className="size-5 text-emerald-800 shrink-0 mt-0.5" />
									<span>{point}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="rounded-[2.5rem] border border-emerald-900/10 bg-emerald-950 p-8 sm:p-10 text-white relative overflow-hidden shadow-lg">
						<div className="relative z-10 space-y-4">
							<div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-lime-300">
								<FlameIcon className="size-6" />
							</div>
							<h3 className="text-2xl font-playfair font-normal">
								Our Promise to You
							</h3>
							<p className="text-xs sm:text-sm leading-relaxed text-emerald-100/80">
								"We don't sell products we wouldn't use ourselves every single
								day. Every scoop, tablet, and bar from ZAMAZOR is engineered to
								deliver genuine results for your training journey."
							</p>
							<p className="text-xs font-bold text-lime-300 uppercase tracking-widest pt-2">
								— The ZAMAZOR Team
							</p>
						</div>
					</div>
				</div>

				{/* --- Core Values --- */}
				<div className="space-y-8">
					<div className="text-center max-w-2xl mx-auto space-y-2">
						<p className="text-xs font-black uppercase tracking-wider text-emerald-800">
							What We Stand For
						</p>
						<h2 className="text-2xl sm:text-4xl font-playfair font-normal text-slate-950">
							Our Guiding Principles
						</h2>
					</div>

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{CORE_VALUES.map((value) => {
							const Icon = value.icon;
							return (
								<div
									key={value.title}
									className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs hover:border-emerald-900/30 transition-all duration-200"
								>
									<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
										<Icon className="size-6" />
									</div>
									<h3 className="mt-4 text-base font-bold text-slate-950">
										{value.title}
									</h3>
									<p className="mt-2 text-xs text-slate-500 leading-relaxed">
										{value.description}
									</p>
								</div>
							);
						})}
					</div>
				</div>

				{/* --- Brand History Timeline --- */}
				<div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 sm:p-12 shadow-xs space-y-8">
					<div>
						<p className="text-xs font-black uppercase tracking-wider text-emerald-800">
							Evolution
						</p>
						<h2 className="text-2xl sm:text-3xl font-playfair font-normal text-slate-950 mt-1">
							Our Journey So Far
						</h2>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative">
						{MILESTONES.map((item) => (
							<div
								key={item.year}
								className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 flex flex-col justify-between"
							>
								<div>
									<span className="font-playfair text-3xl font-black text-emerald-800">
										{item.year}
									</span>
									<h3 className="mt-2 text-base font-bold text-slate-950">
										{item.title}
									</h3>
									<p className="mt-2 text-xs leading-relaxed text-slate-600">
										{item.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* --- Call to Action --- */}
				<div className="rounded-[2.5rem] border border-emerald-900/10 bg-linear-to-br from-emerald-900 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
					<div className="flex flex-col lg:flex-row items-center justify-between gap-8">
						<div className="space-y-2 text-center lg:text-left">
							<h2 className="text-2xl sm:text-3xl font-playfair font-normal">
								Ready to Upgrade Your Nutrition?
							</h2>
							<p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
								Explore our lab-verified collection of proteins, pre-workouts,
								and essential recovery formulas.
							</p>
						</div>

						<Button
							asChild
							className="rounded-xl bg-lime-400 px-8 py-3.5 font-bold text-slate-950 hover:bg-lime-300 shrink-0 cursor-pointer shadow-md"
						>
							<Link to={APP_ROUTES.SHOP}>
								Shop Collection
								<ArrowRightIcon className="ml-2 size-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
