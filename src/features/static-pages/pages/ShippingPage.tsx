import {
	TruckIcon,
	Clock3Icon,
	MapPinIcon,
	ShieldCheckIcon,
	PackageCheckIcon,
	ChevronDownIcon,
	ArrowRightIcon,
	HelpCircleIcon,
	CheckCircle2Icon,
	CreditCardIcon,
	AlertCircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router";
import { APP_ROUTES } from "@/app/routes/paths";
import { useState } from "react";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";

// --- Data ---

const SHIPPING_RATES = [
	{
		region: "Casablanca & Surroundings",
		timeframe: "24 – 48 Hours",
		cost: "25 MAD",
		freeThreshold: "Free over 300 MAD",
		highlight: "Fastest Delivery",
	},
	{
		region: "Major Moroccan Cities (Rabat, Marrakech, Tangier, Agadir, Fes)",
		timeframe: "2 – 3 Business Days",
		cost: "35 MAD",
		freeThreshold: "Free over 400 MAD",
		highlight: "Standard Express",
	},
	{
		region: "Southern Provinces & Remote Regions",
		timeframe: "3 – 5 Business Days",
		cost: "45 MAD",
		freeThreshold: "Free over 500 MAD",
		highlight: "Nationwide Coverage",
	},
];

const PROCESS_STEPS = [
	{
		step: "01",
		title: "Order Placed & Verified",
		description:
			"Your order is confirmed immediately. For Cash on Delivery (COD), our team may send a quick confirmation SMS or call.",
		icon: PackageCheckIcon,
	},
	{
		step: "02",
		title: "Packed with Care",
		description:
			"Products are picked, securely sealed in protective packaging, and assigned a unique tracking number.",
		icon: ShieldCheckIcon,
	},
	{
		step: "03",
		title: "Handed to Courier",
		description:
			"Our courier partner receives your parcel and sends you tracking updates until it safely reaches your door.",
		icon: TruckIcon,
	},
];

const SHIPPING_FAQS = [
	{
		id: "cod",
		question: "How does Cash on Delivery (COD) work?",
		answer:
			"With COD, you pay the exact invoice amount in cash directly to the delivery driver when your package arrives. Please prepare exact change if possible.",
	},
	{
		id: "tracking",
		question: "How do I track my delivery?",
		answer:
			"Once your order ships, you will receive an SMS and email notification containing your tracking code and a direct link to check the courier's real-time progress.",
	},
	{
		id: "missed-call",
		question: "What happens if I miss the driver's phone call?",
		answer:
			"Our courier partners will attempt to contact you up to 3 times over 2 consecutive business days before holding your order at the local regional hub.",
	},
	{
		id: "change-address",
		question: "Can I change my delivery address after placing an order?",
		answer:
			"Yes, provided your package hasn't left our fulfillment warehouse yet. Contact our support team within 2 hours of placing your order to update your details.",
	},
];

// --- Main Shipping Page Component ---

export const ShippingPage = () => {
	const [openFaqId, setOpenFaqId] = useState<string | null>("cod");

	useDocumentTitle(`Shipping & Delivery Policy | ${CONFIG.APP_NAME}`);

	return (
		<div className="min-h-screen bg-[#fcfdfa] py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100">
			<div className="mx-auto max-w-7xl space-y-12">
				{/* --- Hero Section --- */}
				<div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-900/10 bg-linear-to-br from-emerald-950 via-emerald-900 to-slate-950 p-8 sm:p-14 text-white shadow-xl shadow-emerald-950/10">
					<div className="relative z-10 max-w-3xl">
						<p className="text-[11px] font-black uppercase tracking-[0.26em] text-lime-300">
							Logistics & Fulfillment
						</p>
						<h1 className="mt-3 text-3xl sm:text-5xl font-playfair font-normal leading-tight">
							Shipping & Delivery
						</h1>
						<p className="mt-4 text-sm sm:text-base leading-relaxed text-emerald-100/80">
							We deliver high-performance nutrition directly to your doorstep
							across Morocco. Fast, trackable, and reliable express shipping
							options available.
						</p>
					</div>

					{/* Ambient Glow */}
					<div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
				</div>

				{/* --- Key Shipping Highlights --- */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<TruckIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							Fast Shipping
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							Express delivery within 24–48 hours in major metropolitan hubs.
						</p>
					</div>

					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<CreditCardIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							Cash on Delivery
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							Pay conveniently with cash right at your doorstep upon arrival.
						</p>
					</div>

					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<ShieldCheckIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							Insured Package
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							Every shipment is fully insured against damage or loss in transit.
						</p>
					</div>

					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<MapPinIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							100% Nationwide
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							Delivering to all cities and regional provinces throughout
							Morocco.
						</p>
					</div>
				</div>

				{/* --- Delivery Rates Table / Cards --- */}
				<div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 sm:p-10 shadow-xs space-y-6">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
						<div>
							<p className="text-xs font-black uppercase tracking-wider text-emerald-800">
								Morocco Logistics
							</p>
							<h2 className="text-2xl font-playfair font-normal text-slate-950 mt-1">
								Rates & Delivery Timelines
							</h2>
						</div>
						<span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-900">
							<Clock3Icon className="size-3.5" />
							Standard Cutoff: 2:00 PM (GMT+1)
						</span>
					</div>

					<div className="grid gap-4 md:grid-cols-3">
						{SHIPPING_RATES.map((item) => (
							<div
								key={item.region}
								className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-slate-50/40 p-6 hover:border-emerald-900/20 hover:bg-slate-50 transition-all"
							>
								<div>
									<div className="flex items-center justify-between gap-2 mb-3">
										<span className="rounded-full bg-emerald-900/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-900">
											{item.highlight}
										</span>
										<span className="text-xs font-bold text-slate-400">
											{item.timeframe}
										</span>
									</div>

									<h3 className="text-base font-bold text-slate-950">
										{item.region}
									</h3>

									<div className="mt-4 space-y-1">
										<p className="text-2xl font-black text-slate-950">
											{item.cost}
										</p>
										<p className="text-xs font-semibold text-emerald-700">
											{item.freeThreshold}
										</p>
									</div>
								</div>

								<div className="mt-6 border-t border-slate-200/60 pt-4 flex items-center gap-2 text-xs text-slate-500">
									<CheckCircle2Icon className="size-4 text-emerald-800 shrink-0" />
									<span>SMS tracking included</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* --- How Shipping Works Workflow --- */}
				<div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 sm:p-10 shadow-xs space-y-8">
					<div>
						<p className="text-xs font-black uppercase tracking-wider text-emerald-800">
							Fulfillment Journey
						</p>
						<h2 className="text-2xl font-playfair font-normal text-slate-950 mt-1">
							What Happens After You Order?
						</h2>
					</div>

					<div className="grid gap-6 md:grid-cols-3 relative">
						{PROCESS_STEPS.map((step) => {
							const Icon = step.icon;
							return (
								<div
									key={step.step}
									className="relative rounded-3xl border border-slate-100 bg-slate-50/50 p-6 flex flex-col justify-between"
								>
									<div>
										<div className="flex items-center justify-between mb-4">
											<div className="grid size-12 place-items-center rounded-2xl bg-emerald-900 text-white shadow-sm">
												<Icon className="size-6" />
											</div>
											<span className="font-playfair text-3xl font-black text-slate-200">
												{step.step}
											</span>
										</div>

										<h3 className="text-base font-bold text-slate-950">
											{step.title}
										</h3>
										<p className="mt-2 text-xs leading-relaxed text-slate-600">
											{step.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* --- Shipping FAQs --- */}
				<div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 sm:p-10 shadow-xs space-y-6">
					<div className="flex items-center gap-3 border-b border-slate-100 pb-6">
						<div className="grid size-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<HelpCircleIcon className="size-5" />
						</div>
						<div>
							<h2 className="text-2xl font-playfair font-normal text-slate-950">
								Shipping Questions
							</h2>
							<p className="text-xs text-slate-500">
								Everything you need to know about delivery and receiving your
								parcel.
							</p>
						</div>
					</div>

					<div className="space-y-3">
						{SHIPPING_FAQS.map((faq) => {
							const isOpen = openFaqId === faq.id;
							return (
								<div
									key={faq.id}
									className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-200"
								>
									<button
										onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
										className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
										aria-expanded={isOpen}
									>
										<span className="text-base font-playfair font-normal">
											{faq.question}
										</span>
										<ChevronDownIcon
											className={cn(
												"size-5 shrink-0 text-emerald-800 transition-transform duration-200",
												isOpen && "rotate-180",
											)}
										/>
									</button>

									{isOpen && (
										<div className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-4 bg-slate-50/30">
											{faq.answer}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* --- Support Escalation Banner --- */}
				<div className="rounded-[2.5rem] border border-emerald-900/10 bg-linear-to-br from-emerald-900 to-slate-900 p-8 text-white shadow-xl">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex items-start gap-4">
							<div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-lime-300 shrink-0">
								<AlertCircleIcon className="size-6" />
							</div>
							<div>
								<h3 className="text-xl font-playfair font-normal">
									Has your package been delayed?
								</h3>
								<p className="mt-1 text-xs text-emerald-100/80 max-w-xl">
									If your order hasn't arrived within the expected timeframe,
									our support team can directly investigate with the local
									courier desk.
								</p>
							</div>
						</div>

						<Button
							asChild
							className="rounded-xl bg-lime-400 px-6 py-3 font-bold text-slate-950 hover:bg-lime-300 shrink-0 cursor-pointer shadow-sm"
						>
							<Link to={APP_ROUTES.PAGES.CONTACT}>
								Contact Support Desk
								<ArrowRightIcon className="ml-2 size-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
