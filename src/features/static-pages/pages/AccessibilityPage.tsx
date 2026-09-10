import {
	EyeIcon,
	KeyboardIcon,
	SparklesIcon,
	CheckCircle2Icon,
	ChevronDownIcon,
	ArrowRightIcon,
	HelpCircleIcon,
	MessageSquareIcon,
	MonitorCheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router";
import { APP_ROUTES } from "@/app/routes/paths";
import { useState } from "react";
import CONFIG from "@/app/config/constants";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";

const ACCESSIBILITY_FEATURES = [
	{
		icon: KeyboardIcon,
		title: "Keyboard Navigable",
		description:
			"All interactive elements, including navigation menus, product cards, filters, and checkout forms, are fully accessible using standard keyboard shortcuts.",
	},
	{
		icon: EyeIcon,
		title: "High Contrast & Typography",
		description:
			"Color schemes are engineered to satisfy WCAG AA contrast ratio benchmarks, paired with scalable, legible typography across all screen viewports.",
	},
	{
		icon: MonitorCheckIcon,
		title: "Screen Reader Optimized",
		description:
			"Structured using semantic HTML5, descriptive ARIA attributes, and clear alt text for visual images to ensure a smooth screen-reader experience.",
	},
	{
		icon: SparklesIcon,
		title: "Reduced Motion Support",
		description:
			"Our interface respects user OS preferences (`prefers-reduced-motion`) to minimize non-essential animations and prevent visual discomfort.",
	},
];

const ACCESSIBILITY_FAQS = [
	{
		id: "standard",
		question: "What accessibility standard do you aim to meet?",
		answer:
			"ZAMAZOR strives to adhere to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. We continuously audit our UI components to ensure an inclusive digital shopping environment for all users.",
	},
	{
		id: "assistive-tech",
		question: "Is the site compatible with assistive software?",
		answer:
			"Yes. Our components are tested with modern screen readers (NVDA, JAWS, VoiceOver) and integrated keyboard navigation workflows across desktop and mobile browsers.",
	},
	{
		id: "assistance",
		question: "What should I do if I encounter an accessibility barrier?",
		answer:
			"If you experience any difficulty accessing content or placing an order, please reach out to our dedicated support desk. We will gladly assist you over the phone or via email to complete your request.",
	},
];

export default function AccessibilityPage() {
	const [openFaqId, setOpenFaqId] = useState<string | null>("standard");

	useDocumentTitle(`Accessibility Statement | ${CONFIG.APP_NAME}`);

	return (
		<div className="min-h-screen bg-[#fcfdfa] py-12 px-4 sm:px-6 lg:px-8 selection:bg-brand-100">
			<div className="mx-auto max-w-7xl space-y-12">
				{/* --- Hero Header --- */}
				<div className="relative overflow-hidden rounded-hero border border-brand-900/10 bg-linear-to-br from-brand-950 via-brand-900 to-slate-950 p-8 sm:p-14 text-white shadow-xl shadow-brand-950/10">
					<div className="relative z-10 max-w-3xl">
						<p className="text-[11px] font-black uppercase tracking-[0.26em] text-lime-300">
							Inclusive Design
						</p>
						<h1 className="mt-3 text-3xl sm:text-5xl font-playfair font-normal leading-tight">
							Accessibility Statement
						</h1>
						<p className="mt-4 text-sm sm:text-base leading-relaxed text-brand-100/80">
							At ZAMAZOR, we are committed to making our digital experience
							accessible to everyone, regardless of ability or technology. Last
							updated: July 2026.
						</p>
					</div>

					{/* Ambient Glow */}
					<div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
				</div>

				{/* --- Core Features Grid --- */}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{ACCESSIBILITY_FEATURES.map((feature) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.title}
								className="rounded-3xl border border-brand-900/10 bg-white p-6 shadow-xs"
							>
								<div className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-800">
									<Icon className="size-6" />
								</div>
								<h3 className="mt-4 text-base font-bold text-slate-950">
									{feature.title}
								</h3>
								<p className="mt-1 text-xs text-slate-500 leading-relaxed">
									{feature.description}
								</p>
							</div>
						);
					})}
				</div>

				{/* --- Our Commitment Details --- */}
				<div className="rounded-hero border border-brand-900/10 bg-white p-6 sm:p-10 shadow-xs space-y-6">
					<div>
						<p className="text-xs font-black uppercase tracking-wider text-brand-800">
							Standards
						</p>
						<h2 className="text-2xl font-playfair font-normal text-slate-950 mt-1">
							Our Ongoing Commitment
						</h2>
					</div>

					<p className="text-xs sm:text-sm leading-relaxed text-slate-600">
						We continuously audit and refine our online store to conform to the{" "}
						<strong>
							Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
						</strong>
						. These guidelines outline how to make web content more accessible
						for people with disabilities and user-friendly for everyone.
					</p>

					<div className="grid gap-4 md:grid-cols-2 pt-2">
						<div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-2">
							<div className="flex items-center gap-2 font-bold text-slate-950 text-sm">
								<CheckCircle2Icon className="size-4 text-brand-800 shrink-0" />
								<span>Semantic Markup & ARIA Labels</span>
							</div>
							<p className="text-xs text-slate-600 leading-relaxed">
								Forms, dialogs, dynamic carts, and interactive widgets are
								explicitly labeled to provide meaningful context to screen
								reader technologies.
							</p>
						</div>

						<div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-2">
							<div className="flex items-center gap-2 font-bold text-slate-950 text-sm">
								<CheckCircle2Icon className="size-4 text-brand-800 shrink-0" />
								<span>Focus Management</span>
							</div>
							<p className="text-xs text-slate-600 leading-relaxed">
								Visible outline indicators ensure keyboard users can easily
								track active focus when navigating across elements.
							</p>
						</div>
					</div>
				</div>

				{/* --- Accessibility FAQs --- */}
				<div className="rounded-hero border border-brand-900/10 bg-white p-6 sm:p-10 shadow-xs space-y-6">
					<div className="flex items-center gap-3 border-b border-slate-100 pb-6">
						<div className="grid size-10 place-items-center rounded-2xl bg-brand-50 text-brand-800">
							<HelpCircleIcon className="size-5" />
						</div>
						<div>
							<h2 className="text-2xl font-playfair font-normal text-slate-950">
								Frequently Asked Questions
							</h2>
							<p className="text-xs text-slate-500">
								Learn more about our accessibility practices and how to seek
								support.
							</p>
						</div>
					</div>

					<div className="space-y-3">
						{ACCESSIBILITY_FAQS.map((faq) => {
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
												"size-5 shrink-0 text-brand-800 transition-transform duration-200",
												isOpen && "rotate-180"
											)} />
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

				{/* --- Feedback & Assistance Banner --- */}
				<div className="rounded-hero border border-brand-900/10 bg-linear-to-br from-brand-900 to-slate-900 p-8 text-white shadow-xl">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex items-start gap-4">
							<div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-lime-300 shrink-0">
								<MessageSquareIcon className="size-6" />
							</div>
							<div>
								<h3 className="text-xl font-playfair font-normal">
									Need assistance or have feedback?
								</h3>
								<p className="mt-1 text-xs text-brand-100/80 max-w-xl">
									We welcome your feedback on the accessibility of ZAMAZOR. If
									you encounter accessibility barriers, please let us know so we
									can resolve them promptly.
								</p>
							</div>
						</div>

						<Button
							asChild
							className="rounded-lg bg-lime-400 px-6 py-3 font-bold text-slate-950 hover:bg-lime-300 shrink-0 cursor-pointer shadow-sm"
						>
							<Link to={APP_ROUTES.PAGES.CONTACT}>
								Submit Accessibility Feedback
								<ArrowRightIcon className="ml-2 size-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
