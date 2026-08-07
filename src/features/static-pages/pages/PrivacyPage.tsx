import {
	ShieldCheckIcon,
	LockIcon,
	EyeIcon,
	FileTextIcon,
	DatabaseIcon,
	UserCheckIcon,
	ChevronDownIcon,
	ArrowRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router";
import { APP_ROUTES } from "@/app/routes/paths";
import { useState } from "react";
import CONFIG from "@/app/config/constants";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";

// --- Privacy Policy Sections Data ---

const PRIVACY_SECTIONS = [
	{
		id: "collection",
		title: "1. Information We Collect",
		content:
			"When you place an order or create an account on ZAMAZOR, we collect personal information necessary to fulfill your purchases. This includes your full name, shipping address, phone number (required for courier delivery coordination and COD confirmation), email address, and order history.",
	},
	{
		id: "usage",
		title: "2. How We Use Your Data",
		content:
			"We process your personal information strictly to fulfill your orders, arrange doorstep delivery across Morocco, process payments, issue invoices, send tracking updates via SMS or email, and provide customer support. With your explicit consent, we may also send you occasional product updates or promotional offers.",
	},
	{
		id: "law-0908",
		title: "3. Compliance with Moroccan Law No. 09-08",
		content:
			"Your personal data is handled in strict compliance with Moroccan Law No. 09-08 relating to the protection of individuals with respect to the processing of personal data (CNDP). ZAMAZOR implements appropriate technical and organizational safeguards to prevent unauthorized access, loss, or alteration of your personal records.",
	},
	{
		id: "third-parties",
		title: "4. Third-Party Data Sharing & Courier Dispatch",
		content:
			"We do not sell, rent, or trade your personal information to third parties. We only share essential delivery details (your name, address, and contact number) with our trusted logistics courier partners across Morocco solely for delivering your parcel and receiving payment for COD orders.",
	},
	{
		id: "cookies",
		title: "5. Cookies & Tracking Technologies",
		content:
			"ZAMAZOR uses essential cookies to keep track of your shopping cart, maintain session authentication, and analyze general website traffic. Cookies help us optimize page load speed and improve your overall shopping experience. You can manage or disable cookies via your browser settings.",
	},
	{
		id: "rights",
		title: "6. Your Data Rights (Access, Correction & Deletion)",
		content:
			"In accordance with Law No. 09-08, you have the right to access, rectify, or request the complete deletion of your personal data stored in our systems. To exercise your rights or request account closure, please contact our privacy compliance desk at support@zamazor.ma.",
	},
];

// --- Main Privacy Page Component ---

export const PrivacyPage = () => {
	const [activeSection, setActiveSection] = useState<string | null>(
		"collection",
	);

	useDocumentTitle(`Privacy Policy | ${CONFIG.APP_NAME}`);

	return (
		<div className="min-h-screen bg-[#fcfdfa] py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100">
			<div className="mx-auto max-w-7xl space-y-12">
				{/* --- Hero Header --- */}
				<div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-900/10 bg-linear-to-br from-emerald-950 via-emerald-900 to-slate-950 p-8 sm:p-14 text-white shadow-xl shadow-emerald-950/10">
					<div className="relative z-10 max-w-3xl">
						<p className="text-[11px] font-black uppercase tracking-[0.26em] text-lime-300">
							Data Governance & Safety
						</p>
						<h1 className="mt-3 text-3xl sm:text-5xl font-playfair font-normal leading-tight">
							Privacy Policy
						</h1>
						<p className="mt-4 text-sm sm:text-base leading-relaxed text-emerald-100/80">
							We value your trust. Learn how we collect, protect, and handle
							your personal data across our operations in Morocco. Last updated:
							July 2026.
						</p>
					</div>

					{/* Ambient Glow */}
					<div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
				</div>

				{/* --- Key Security Highlights --- */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<ShieldCheckIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							Law 09-08 Compliant
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							Adheres to national CNDP standards for personal data protection.
						</p>
					</div>

					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<LockIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							SSL Encryption
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							All website interactions and transactions are encrypted securely.
						</p>
					</div>

					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<EyeIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							No Data Selling
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							We never sell or rent your personal information to marketing
							brokers.
						</p>
					</div>

					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<UserCheckIcon className="size-6" />
						</div>
						<h3 className="mt-4 text-base font-bold text-slate-950">
							Full Control
						</h3>
						<p className="mt-1 text-xs text-slate-500 leading-relaxed">
							Request access, modifications, or deletion of your data at any
							time.
						</p>
					</div>
				</div>

				{/* --- Privacy Policy Accordion Sections --- */}
				<div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 sm:p-10 shadow-xs space-y-6">
					<div className="flex items-center gap-3 border-b border-slate-100 pb-6">
						<div className="grid size-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<FileTextIcon className="size-5" />
						</div>
						<div>
							<h2 className="text-2xl font-playfair font-normal text-slate-950">
								Detailed Privacy Guidelines
							</h2>
							<p className="text-xs text-slate-500">
								Click on any section below to learn more about how your data is
								used.
							</p>
						</div>
					</div>

					<div className="space-y-3">
						{PRIVACY_SECTIONS.map((section) => {
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
												"size-5 shrink-0 text-emerald-800 transition-transform duration-200",
												isOpen && "rotate-180",
											)}
										/>
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

				{/* --- Support & Data Rights Banner --- */}
				<div className="rounded-[2.5rem] border border-emerald-900/10 bg-linear-to-br from-emerald-900 to-slate-900 p-8 text-white shadow-xl">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex items-start gap-4">
							<div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-lime-300 shrink-0">
								<DatabaseIcon className="size-6" />
							</div>
							<div>
								<h3 className="text-xl font-playfair font-normal">
									Want to request a copy or deletion of your data?
								</h3>
								<p className="mt-1 text-xs text-emerald-100/80 max-w-xl">
									Contact our data protection team with your account details. We
									process all privacy requests within 48 business hours.
								</p>
							</div>
						</div>

						<Button
							asChild
							className="rounded-xl bg-lime-400 px-6 py-3 font-bold text-slate-950 hover:bg-lime-300 shrink-0 cursor-pointer shadow-sm"
						>
							<Link to={APP_ROUTES.PAGES.CONTACT}>
								Contact Privacy Desk
								<ArrowRightIcon className="ml-2 size-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
