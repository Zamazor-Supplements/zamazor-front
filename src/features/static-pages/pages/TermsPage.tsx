import {
	FileTextIcon,
	ShieldCheckIcon,
	ScaleIcon,
	CreditCardIcon,
	ChevronDownIcon,
	ArrowRightIcon,
	LockIcon,
	HelpCircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_ROUTES } from "@/app/routes/paths";
import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";
import { useState } from "react";

const TERMS_SECTIONS = [
	{
		id: "general",
		title: "1. Acceptance of Terms & Services",
		content:
			"By accessing, browsing, or making a purchase on ZAMAZOR ('the Site'), you agree to be bound by these Terms and Conditions and all applicable laws and regulations of the Kingdom of Morocco. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
	},
	{
		id: "legal-framework",
		title: "2. Consumer Protection Legal Framework",
		content:
			"Our operations and transaction policies strictly adhere to Moroccan Law No. 31-08 enacting measures for consumer protection. As a consumer, you benefit from statutory guarantees including product conformity, clear pre-contractual information, and rights of cancellation as stipulated by Moroccan commerce regulations.",
	},
	{
		id: "orders-pricing",
		title: "3. Pricing, Payments & Cash on Delivery (COD)",
		content:
			"All prices listed on ZAMAZOR are in Moroccan Dirhams (MAD) and include applicable taxes (TVA) unless otherwise specified. We reserve the right to modify prices at any time without prior notice. For Cash on Delivery (COD) orders, payment must be handed in full to the courier upon delivery before opening outer shipping seals.",
	},
	{
		id: "shipping-delivery",
		title: "4. Fulfillment & Delivery Obligations",
		content:
			"Delivery timelines provided on our platform are estimates executed through third-party courier partners across Morocco. ZAMAZOR is committed to processing orders promptly, but is not held liable for delays caused by force majeure, incorrect customer addresses, or unreturned phone calls from local dispatchers.",
	},
	{
		id: "returns-cancellation",
		title: "5. Order Cancellations & Returns",
		content:
			"Customers have the right to cancel or return unopened nutritional products within 14 days of receipt under our Return Policy. Due to health and hygiene standards, opened nutritional supplements, unsealed tubs, or items with broken safety seals cannot be returned unless confirmed defective upon arrival.",
	},
	{
		id: "product-disclaimer",
		title: "6. Product Information & Health Disclaimer",
		content:
			"Statements made regarding dietary supplements on this Site have not been evaluated as medical advice. Products sold on ZAMAZOR are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before beginning any diet or exercise regimen.",
	},
	{
		id: "intellectual-property",
		title: "7. Intellectual Property Rights",
		content:
			"All materials contained on this website—including logos, product graphics, UI designs, copy, and code—are the exclusive intellectual property of ZAMAZOR and are protected under Moroccan and international copyright and trademark laws.",
	},
	{
		id: "jurisdiction",
		title: "8. Governing Law & Dispute Resolution",
		content:
			"These terms shall be governed by and construed in accordance with the laws of the Kingdom of Morocco. In the event of any dispute or claim arising out of these terms, the competent courts of Casablanca shall have exclusive jurisdiction.",
	},
];

export default function TermsPage() {
	const [activeSection, setActiveSection] = useState<string | null>("general");

	useDocumentTitle(`Terms & Conditions | ${CONFIG.APP_NAME}`);

	return (
		<div className="min-h-screen bg-[#fcfdfa] py-12 px-4 sm:px-6 lg:px-8 selection:bg-brand-100">
			<div className="mx-auto max-w-7xl space-y-12">
				{/* --- Hero Header --- */}
				<div className="relative overflow-hidden rounded-hero border border-brand-900/10 bg-linear-to-br from-brand-950 via-brand-900 to-slate-950 p-8 sm:p-14 text-white shadow-xl shadow-brand-950/10">
					<div className="relative z-10 max-w-3xl">
						<p className="text-[11px] font-black uppercase tracking-[0.26em] text-lime-300">
							Legal & Compliance
						</p>
						<h1 className="mt-3 text-3xl sm:text-5xl font-playfair font-normal leading-tight">
							Terms & Conditions
						</h1>
						<p className="mt-4 text-sm sm:text-base leading-relaxed text-brand-100/80">
							Please read these terms carefully before placing an order. Last
							updated: July 2026.
						</p>
					</div>

					{/* Ambient Glow */}
					<div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
				</div>

				{/* --- Key Legal Highlights --- */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-3xl border border-brand-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-800">
							<ScaleIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							Moroccan Law 31-08
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							Fully compliant with national consumer protection standards.
						</p>
					</div>

					<div className="rounded-3xl border border-brand-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-800">
							<CreditCardIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							Transparent Pricing
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							All prices displayed in MAD with no hidden checkout surcharges.
						</p>
					</div>

					<div className="rounded-3xl border border-brand-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-800">
							<ShieldCheckIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							14-Day Guarantee
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							Standard return rights on unopened and factory-sealed products.
						</p>
					</div>

					<div className="rounded-3xl border border-brand-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-800">
							<LockIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							Data Security
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							Strict privacy protocols for handling customer order information.
						</p>
					</div>
				</div>

				{/* --- Terms Accordion Sections --- */}
				<div className="rounded-hero border border-brand-900/10 bg-white p-6 sm:p-10 shadow-xs space-y-6">
					<div className="flex items-center gap-3 border-b border-slate-100 pb-6">
						<div className="grid size-10 place-items-center rounded-2xl bg-brand-50 text-brand-800">
							<FileTextIcon className="size-5" />
						</div>
						<div>
							<h2 className="text-2xl font-playfair font-normal text-slate-950">
								Terms of Service Overview
							</h2>
							<p className="text-xs text-slate-500">
								Click on a section below to read details regarding our
								agreement.
							</p>
						</div>
					</div>

					<div className="space-y-3">
						{TERMS_SECTIONS.map((section) => {
							const isOpen = activeSection === section.id;
							return (
								<div
									key={section.id}
									className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-200"
								>
									<button
										onClick={() => setActiveSection(isOpen ? null : section.id)}
										className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
										aria-expanded={isOpen}
									>
										<span className="text-base font-playfair font-normal">
											{section.title}
										</span>
										<ChevronDownIcon
											className={cn(
												"size-5 shrink-0 text-brand-800 transition-transform duration-200",
												isOpen && "rotate-180"
											)} />
									</button>

									{isOpen && (
										<div className="px-5 pb-5 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100 pt-4 bg-slate-50/30">
											{section.content}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>

				{/* --- Support & Legal Inquiries Banner --- */}
				<div className="rounded-hero border border-brand-900/10 bg-linear-to-br from-brand-900 to-slate-900 p-8 text-white shadow-xl">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex items-start gap-4">
							<div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-lime-300 shrink-0">
								<HelpCircleIcon className="size-6" />
							</div>
							<div>
								<h3 className="text-xl font-playfair font-normal">
									Have questions about our terms?
								</h3>
								<p className="mt-1 text-xs text-brand-100/80 max-w-xl">
									Our customer desk is available to clarify any terms regarding
									your orders, corporate purchasing, or legal compliance.
								</p>
							</div>
						</div>

						<Button
							asChild
							className="rounded-lg bg-lime-400 px-6 py-3 font-bold text-slate-950 hover:bg-lime-300 shrink-0 cursor-pointer shadow-sm"
						>
							<Link to={APP_ROUTES.PAGES.CONTACT}>
								Contact Legal Support
								<ArrowRightIcon className="ml-2 size-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
