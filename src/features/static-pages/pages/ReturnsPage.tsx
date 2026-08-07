import {
	RotateCcwIcon,
	ShieldCheckIcon,
	Clock3Icon,
	CheckCircle2Icon,
	XCircleIcon,
	ChevronDownIcon,
	ArrowRightIcon,
	HelpCircleIcon,
	TruckIcon,
	BanknoteIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router";
import { APP_ROUTES } from "@/app/routes/paths";
import { useState } from "react";
import CONFIG from "@/app/config/constants";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";

const RETURN_CONDITIONS = [
	{
		status: "eligible",
		title: "Eligible for Return & Exchange",
		items: [
			"Unopened items with original seals completely intact",
			"Products in original packaging with all labels attached",
			"Damaged or defective items received upon delivery",
			"Incorrect item sent due to a fulfillment error",
		],
	},
	{
		status: "non-eligible",
		title: "Non-Eligible Items",
		items: [
			"Opened supplements or broken safety seals",
			"Products returned after the 14-day window",
			"Items damaged due to improper customer storage or heat exposure",
			"Final sale items marked non-returnable during clearance",
		],
	},
] as const;

const RETURN_STEPS = [
	{
		step: "01",
		title: "Submit a Request",
		description:
			"Contact our support team within 14 days of delivery. Include your order ID and photos if the item arrived damaged.",
		icon: RotateCcwIcon,
	},
	{
		step: "02",
		title: "Pack & Hand Over",
		description:
			"Place the unopened item back into its original box. Our courier partner will pick up the parcel directly from your address.",
		icon: TruckIcon,
	},
	{
		step: "03",
		title: "Inspection & Refund",
		description:
			"Once inspected at our warehouse, your refund or replacement item will be issued within 48 to 72 hours.",
		icon: BanknoteIcon,
	},
];

const RETURN_FAQS = [
	{
		id: "fees",
		question: "Are there any return shipping fees?",
		answer:
			"Returns due to fulfillment errors or damaged goods upon arrival are 100% free. For standard mind-change returns, a flat return courier pickup fee of 30 MAD applies.",
	},
	{
		id: "cod-refund",
		question: "How do I get refunded if I paid Cash on Delivery (COD)?",
		answer:
			"For COD payments, refunds can be processed either as store credit for your next order or via direct bank transfer (RIB) to your Moroccan bank account within 3 business days.",
	},
	{
		id: "exchange",
		question: "Can I exchange an item for a different flavor or size?",
		answer:
			"Yes! As long as the seal is unopened, you can request an exchange. If there is a price difference, we will adjust the invoice accordingly upon pickup.",
	},
	{
		id: "damaged",
		question: "What should I do if my package arrives damaged?",
		answer:
			"Take photos of the outer box and damaged product immediately upon receipt and email support@zamazor.ma or contact us via WhatsApp. We will dispatch a immediate replacement.",
	},
];

// --- Main Returns Page Component ---

export const ReturnsPage = () => {
	const [openFaqId, setOpenFaqId] = useState<string | null>("fees");

	useDocumentTitle(`Returns & Refund Policy | ${CONFIG.APP_NAME}`);

	return (
		<div className="min-h-screen bg-[#fcfdfa] py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100">
			<div className="mx-auto max-w-7xl space-y-12">
				{/* --- Hero Section --- */}
				<div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-900/10 bg-linear-to-br from-emerald-950 via-emerald-900 to-slate-950 p-8 sm:p-14 text-white shadow-xl shadow-emerald-950/10">
					<div className="relative z-10 max-w-3xl">
						<p className="text-[11px] font-black uppercase tracking-[0.26em] text-lime-300">
							Customer Protection
						</p>
						<h1 className="mt-3 text-3xl sm:text-5xl font-playfair font-normal leading-tight">
							Returns & Refund Policy
						</h1>
						<p className="mt-4 text-sm sm:text-base leading-relaxed text-emerald-100/80">
							Your satisfaction is guaranteed. We offer a simple 14-day
							hassle-free return policy on all unopened items across Morocco.
						</p>
					</div>

					{/* Ambient Glow */}
					<div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
				</div>

				{/* --- Policy Highlights --- */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<Clock3Icon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							14-Day Guarantee
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							Full return window from the day your package is delivered.
						</p>
					</div>

					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<TruckIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							Doorstep Pickup
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							Our courier collects the returned item directly from your address.
						</p>
					</div>

					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<ShieldCheckIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							Sealed Protection
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							Ensures quality and safety standards for all nutritional products.
						</p>
					</div>

					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<BanknoteIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							Fast Refund Processing
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							Refunds completed via store credit or RIB within 48–72 hours.
						</p>
					</div>
				</div>

				{/* --- Eligibility Matrix (Eligible vs Non-Eligible) --- */}
				<div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 sm:p-10 shadow-xs space-y-6">
					<div>
						<p className="text-xs font-black uppercase tracking-wider text-emerald-800">
							Requirements
						</p>
						<h2 className="text-2xl font-playfair font-normal text-slate-950 mt-1">
							Is Your Item Eligible for Return?
						</h2>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						{/* Eligible Column */}
						<div className="rounded-3xl border border-emerald-900/20 bg-emerald-50/30 p-6 space-y-4">
							<div className="flex items-center gap-3 border-b border-emerald-900/10 pb-4">
								<CheckCircle2Icon className="size-6 text-emerald-800 shrink-0" />
								<h3 className="text-base font-bold text-slate-950">
									{RETURN_CONDITIONS[0].title}
								</h3>
							</div>
							<ul className="space-y-3">
								{RETURN_CONDITIONS[0].items.map((item, idx) => (
									<li
										key={idx}
										className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
									>
										<span className="mt-1 size-1.5 rounded-full bg-emerald-700 shrink-0" />
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>

						{/* Non-Eligible Column */}
						<div className="rounded-3xl border border-rose-200 bg-rose-50/20 p-6 space-y-4">
							<div className="flex items-center gap-3 border-b border-rose-100 pb-4">
								<XCircleIcon className="size-6 text-rose-600 shrink-0" />
								<h3 className="text-base font-bold text-slate-950">
									{RETURN_CONDITIONS[1].title}
								</h3>
							</div>
							<ul className="space-y-3">
								{RETURN_CONDITIONS[1].items.map((item, idx) => (
									<li
										key={idx}
										className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
									>
										<span className="mt-1 size-1.5 rounded-full bg-rose-500 shrink-0" />
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				{/* --- Step-by-Step Return Process --- */}
				<div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 sm:p-10 shadow-xs space-y-8">
					<div>
						<p className="text-xs font-black uppercase tracking-wider text-emerald-800">
							Workflow
						</p>
						<h2 className="text-2xl font-playfair font-normal text-slate-950 mt-1">
							How to Initiate a Return
						</h2>
					</div>

					<div className="grid gap-6 md:grid-cols-3">
						{RETURN_STEPS.map((step) => {
							const Icon = step.icon;
							return (
								<div
									key={step.step}
									className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 flex flex-col justify-between"
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

				{/* --- Returns FAQs --- */}
				<div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 sm:p-10 shadow-xs space-y-6">
					<div className="flex items-center gap-3 border-b border-slate-100 pb-6">
						<div className="grid size-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<HelpCircleIcon className="size-5" />
						</div>
						<div>
							<h2 className="text-2xl font-playfair font-normal text-slate-950">
								Frequently Asked Questions
							</h2>
							<p className="text-xs text-slate-500">
								Quick solutions to common questions regarding returns and
								refunds.
							</p>
						</div>
					</div>

					<div className="space-y-3">
						{RETURN_FAQS.map((faq) => {
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

				{/* --- Support Callout Banner --- */}
				<div className="rounded-[2.5rem] border border-emerald-900/10 bg-linear-to-br from-emerald-900 to-slate-900 p-8 text-white shadow-xl">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex items-start gap-4">
							<div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-lime-300 shrink-0">
								<RotateCcwIcon className="size-6" />
							</div>
							<div>
								<h3 className="text-xl font-playfair font-normal">
									Ready to request a return or exchange?
								</h3>
								<p className="mt-1 text-xs text-emerald-100/80 max-w-xl">
									Contact our support team with your order number. We will
									arrange a courier pickup at a time convenient for you.
								</p>
							</div>
						</div>

						<Button
							asChild
							className="rounded-xl bg-lime-400 px-6 py-3 font-bold text-slate-950 hover:bg-lime-300 shrink-0 cursor-pointer shadow-sm"
						>
							<Link to={APP_ROUTES.PAGES.CONTACT}>
								Start Return Request
								<ArrowRightIcon className="ml-2 size-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
