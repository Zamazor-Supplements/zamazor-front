import { Link, useNavigate } from "react-router";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";
import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import {
	ArrowRightIcon,
	CheckIcon,
	CopyIcon,
	MailIcon,
	PhoneIcon,
} from "lucide-react";
import { useState } from "react";
import { type FAQCategory } from "@/features/faq/config/categories";
import { Highlights } from "@/features/faq/components/highlights/Highlights";
import { HeroBanner } from "@/features/faq/components/hero/HeroBanner";
import { FAQAccordions } from "@/features/faq/components/faq/FAQAccordions";
import { FAQCategoryFilters } from "@/features/faq/components/faq/FAQCategoryFilters";

export const FAQPage = () => {
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
		<div className="min-h-screen bg-[#fcfdfa] py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100">
			<div className="mx-auto max-w-7xl space-y-10">
				<HeroBanner
					query={searchQuery}
					onChange={(q: string) => setSearchQuery(q)}
				/>
				<Highlights />

				{/* --- FAQ Interactive Area --- */}
				<div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 sm:p-10 shadow-xs">
					{/* Header & Filter Chips */}
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
						<div>
							<p className="text-xs font-black uppercase tracking-widest text-emerald-700">
								Quick Navigation
							</p>
							<h2 className="mt-1 text-2xl font-playfair font-normal text-slate-950">
								Browse Questions
							</h2>
						</div>

						{/* Category Filter Pills */}
						<FAQCategoryFilters
							selectedCategory={selectedCategory}
							onChange={(c: FAQCategory) => setSelectedCategory(c)}
						/>
					</div>

					{/* Accordion List */}
					<FAQAccordions
						query={searchQuery}
						selectedCategory={selectedCategory}
						resetFilters={resetFilters}
					/>
				</div>

				{/* --- Still Have Questions / Contact CTA --- */}
				<div className="grid gap-6 lg:grid-cols-[1fr_360px]">
					<div className="flex flex-col justify-between rounded-[2rem] border border-emerald-900/10 bg-white p-8 shadow-xs">
						<div>
							<h2 className="text-2xl font-playfair font-normal text-slate-950">
								Need a more specific answer?
							</h2>
							<p className="mt-3 text-sm leading-relaxed text-slate-500 max-w-xl">
								Our support team is ready to help you with active orders, custom
								formula recommendations, bulk purchasing for gyms, or address
								updates.
							</p>
						</div>
						<div className="mt-6 flex items-center gap-4">
							<Button
								onClick={() => navigate(APP_ROUTES.PAGES.CONTACT)}
								className="rounded-xl bg-emerald-950 px-6 py-3 text-white hover:bg-emerald-900 cursor-pointer font-semibold text-sm"
							>
								Send a message
								<ArrowRightIcon className="ml-2 size-4" />
							</Button>
						</div>
					</div>

					<div className="rounded-[2rem] border border-emerald-900/10 bg-[#f2f8ef] p-8 flex flex-col justify-between">
						<div>
							<p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
								Direct Contact
							</p>

							<div className="mt-5 space-y-4">
								{/* Email with copy button */}
								<div className="flex items-center justify-between rounded-xl bg-white p-3 border border-emerald-900/5 shadow-xs">
									<div className="flex items-center gap-3">
										<MailIcon className="size-4 text-emerald-800" />
										<span className="text-sm font-semibold text-slate-900">
											{CONFIG.SUPPORT_EMAIL}
										</span>
									</div>
									<button
										onClick={handleCopyEmail}
										className="p-1.5 text-slate-400 hover:text-emerald-800 transition-colors cursor-pointer"
										title="Copy email"
									>
										{copiedEmail ? (
											<CheckIcon className="size-4 text-emerald-700" />
										) : (
											<CopyIcon className="size-4" />
										)}
									</button>
								</div>

								{/* Phone */}
								<div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-emerald-900/5 shadow-xs">
									<PhoneIcon className="size-4 text-emerald-800" />
									<span className="text-sm font-semibold text-slate-900">
										{CONFIG.SUPPORT_PHONE}
									</span>
								</div>
							</div>
						</div>

						<Button
							asChild
							className="mt-6 h-11 w-full rounded-xl bg-emerald-900 text-white hover:bg-emerald-950 cursor-pointer"
						>
							<Link to={APP_ROUTES.PAGES.CONTACT}>
								Go to contact page
								<ArrowRightIcon className="ml-2 size-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
