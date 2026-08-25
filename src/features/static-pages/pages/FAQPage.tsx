import { Link, useNavigate } from "react-router";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";
import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import {
	ArrowRightIcon,
	CheckIcon,
	CopyIcon,
	HeadsetIcon,
	MailIcon,
	PhoneIcon,
} from "lucide-react";
import { useState } from "react";
import { type FAQCategory } from "@/features/faq/config/categories";
import { Highlights } from "@/features/faq/components/highlights/Highlights";
import { HeroBanner } from "@/features/faq/components/hero/HeroBanner";
import { FAQAccordions } from "@/features/faq/components/faq/FAQAccordions";
import { FAQCategoryFilters } from "@/features/faq/components/faq/FAQCategoryFilters";

export default function FAQPage() {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<FAQCategory>("All");
	const [copiedEmail, setCopiedEmail] = useState(false);

	useDocumentTitle(`FAQs | ${CONFIG.APP_NAME}`);

	const handleCopyEmail = () => {
		void navigator.clipboard.writeText(CONFIG.SUPPORT_EMAIL);
		setCopiedEmail(true);
		setTimeout(() => setCopiedEmail(false), 2000);
	};

	const resetFilters = () => {
		setSelectedCategory("All");
		setSearchQuery("");
	};

	return (
		<div className="min-h-screen bg-linear-to-b from-[#fcfdfa] via-white to-[#f9faf7] py-16 px-4 sm:px-6 lg:px-8 selection:bg-brand-100 selection:text-brand-900">
			<div className="mx-auto max-w-7xl space-y-12">
				{/* Hero Section */}
				<HeroBanner
					query={searchQuery}
					onChange={(q: string) => setSearchQuery(q)} />

				{/* Highlights Bar */}
				<Highlights />

				{/* --- FAQ Interactive Main Container --- */}
				<div className="rounded-xl border border-slate-200/60 bg-white p-8 sm:p-12 shadow-xl shadow-slate-950/5 backdrop-blur-xl">
					{/* Header & Filter Chips */}
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
						<div>
							<div className="flex items-center gap-2">
								<span className="flex h-2 w-2 rounded-full bg-brand-800 animate-pulse" />
								<span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand-800">
									Knowledge Base
								</span>
							</div>
							<h2 className="mt-2 text-3xl font-playfair font-normal tracking-tight text-slate-950">
								Browse Questions
							</h2>
						</div>

						{/* Category Filter Pills */}
						<FAQCategoryFilters
							selectedCategory={selectedCategory}
							onChange={(c: FAQCategory) => setSelectedCategory(c)} />
					</div>

					{/* Accordion List */}
					<div className="pt-8">
						<FAQAccordions
							query={searchQuery}
							selectedCategory={selectedCategory}
							resetFilters={resetFilters} />
					</div>
				</div>

				{/* --- Still Have Questions / Contact CTA Section --- */}
				<div className="grid gap-8 lg:grid-cols-[1fr_380px]">
					{/* Left Large Support Box */}
					<div className="group relative overflow-hidden flex flex-col justify-between rounded-xl border border-slate-200/60 bg-white p-8 sm:p-10 shadow-xl shadow-slate-950/5 transition-all hover:border-brand-900/20">
						<div className="absolute top-0 right-0 -mt-12 -mr-12 size-48 rounded-full bg-brand-50/50 blur-3xl pointer-events-none group-hover:bg-brand-100/60 transition-all" />

						<div className="relative z-10">
							<span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-[11px] font-extrabold tracking-wider text-brand-900 uppercase">
								Expert Assistance
							</span>
							<h3 className="mt-4 text-2xl sm:text-3xl font-playfair font-normal tracking-tight text-slate-950">
								Need a more tailored solution?
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-slate-500 max-w-xl">
								Our support team and sports nutritionists are ready to help you
								with active orders, custom formula recommendations, bulk
								purchasing for gyms, or subscription updates.
							</p>
						</div>

						<div className="relative z-10 mt-8 flex items-center gap-4">
							<Button
								onClick={() => navigate(APP_ROUTES.PAGES.CONTACT)}
								className="group/btn h-12 rounded-xl bg-brand-950 px-7 text-white hover:bg-brand-900 cursor-pointer font-semibold text-sm shadow-md shadow-brand-950/10 transition-all active:scale-98"
							>
								<span>Send a message</span>
								<ArrowRightIcon className="ml-2 size-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
							</Button>
						</div>
					</div>

					{/* Right Direct Contact & Details Box */}
					<div className="relative overflow-hidden rounded-xl border border-brand-900/10 bg-linear-to-br from-[#f4f8f1] to-[#edf4ea] p-8 sm:p-10 flex flex-col justify-between shadow-lg shadow-brand-950/5">
						<div>
							<div className="flex items-center gap-2">
								<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-900/10 text-brand-900">
									<HeadsetIcon className="size-4" />
								</div>
								<p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand-900">
									Direct Line
								</p>
							</div>

							<div className="mt-6 space-y-3.5">
								{/* Email with copy button */}
								<div className="group/item flex items-center justify-between rounded-xl bg-white/90 p-4 border border-brand-900/10 shadow-xs backdrop-blur-xs transition-all hover:bg-white hover:shadow-md">
									<div className="flex items-center gap-3.5 min-w-0">
										<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800">
											<MailIcon className="size-4" />
										</div>
										<div className="min-w-0">
											<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
												Email Us
											</p>
											<span className="text-xs sm:text-sm font-bold text-slate-900 truncate block">
												{CONFIG.SUPPORT_EMAIL}
											</span>
										</div>
									</div>
									<button
										onClick={handleCopyEmail}
										className="relative shrink-0 ml-2 rounded-xl p-2 text-slate-400 hover:bg-brand-50 hover:text-brand-900 transition-all cursor-pointer"
										title="Copy email"
									>
										{copiedEmail ? (
											<CheckIcon className="size-4" />
										) : (
											<CopyIcon className="size-4" />
										)}
									</button>
								</div>

								{/* Phone */}
								<div className="flex items-center gap-3.5 rounded-xl bg-white/90 p-4 border border-brand-900/10 shadow-xs backdrop-blur-xs transition-all hover:bg-white hover:shadow-md">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800">
										<PhoneIcon className="size-4" />
									</div>
									<div>
										<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
											Call Support
										</p>
										<span className="text-xs sm:text-sm font-bold text-slate-900 block">
											{CONFIG.SUPPORT_PHONE}
										</span>
									</div>
								</div>
							</div>
						</div>

						<Button
							asChild
							className="group/link mt-8 h-12 w-full rounded-xl bg-brand-900 text-white hover:bg-brand-950 cursor-pointer font-semibold text-sm shadow-md shadow-brand-900/20 transition-all active:scale-98"
						>
							<Link
								to={APP_ROUTES.PAGES.CONTACT}
								className="flex items-center justify-center"
							>
								<span>Go to contact page</span>
								<ArrowRightIcon className="ml-2 size-4 transition-transform duration-200 group-hover/link:translate-x-1" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
