import { Link } from "react-router";
import { ArrowRightIcon, GlobeIcon } from "lucide-react";
import { APP_ROUTES } from "@/app/routes/paths";
import { useLanguage } from "@/shared/hooks/use-language";
import { APP_COUNTRY, COUNTRY_CODE } from "@/app/config/constants";

const InstagramIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
		<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
		<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
	</svg>
);

// Import the 6 assets for the Instagram grid
import cardImmune from "@/assets/images/card_immune.png";
import cardMind from "@/assets/images/card_mind.png";
import cardNutrient from "@/assets/images/card_nutrient.png";
import heroProtein from "@/assets/images/hero_protein.png";
import heroRecovery from "@/assets/images/hero_recovery.png";
import heroGreens from "@/assets/images/hero_greens.png";
import CONFIG from "@/app/config/constants";

export const Footer = () => {
	const { language } = useLanguage();

	return (
		<footer className="bg-brand-950 text-brand-200 font-sans pt-16 pb-8 border-t border-brand-950/20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Top Section */}
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 pb-12">
					{/* Brand Column */}
					<div className="lg:col-span-6 flex flex-col justify-start">
						<span className="font-playfair text-brand-100 text-3xl font-semibold tracking-tight">
							Zamazor
						</span>
						<h2 className="font-playfair text-white text-3xl sm:text-4xl md:text-5xl font-medium leading-tight mt-6 max-w-md">
							We’re obsessed with clean, honest supplements.
						</h2>
					</div>

					{/* Links Columns */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:col-span-6">
						{/* Company */}
						<div>
							<h3 className="font-playfair text-white text-lg font-medium mb-4">
								Company
							</h3>
							<ul className="space-y-3 text-sm">
								<li>
									<Link
										to={APP_ROUTES.SHOP}
										className="hover:text-white transition-colors font-bold text-accent"
									>
										Shop Formulas
									</Link>
								</li>
								<li>
									<Link
										to={APP_ROUTES.PAGES.ABOUT}
										className="hover:text-white transition-colors"
									>
										Our Story
									</Link>
								</li>
								<li>
									<Link
										to={APP_ROUTES.PAGES.CONTACT}
										className="hover:text-white transition-colors"
									>
										Contact
									</Link>
								</li>
								<li>
									<Link
										to={APP_ROUTES.PAGES.FAQ}
										className="hover:text-white transition-colors"
									>
										FAQs
									</Link>
								</li>
							</ul>
						</div>

						{/* Get Help */}
						<div>
							<h3 className="font-playfair text-white text-lg font-medium mb-4">
								Get Help
							</h3>
							<ul className="space-y-3 text-sm">
								<li>
									<Link
										to={APP_ROUTES.PAGES.HELP}
										className="hover:text-white transition-colors"
									>
										Help Center
									</Link>
								</li>
								<li>
									<Link
										to={APP_ROUTES.PAGES.RETURNS}
										className="hover:text-white transition-colors"
									>
										Return Policy
									</Link>
								</li>
								<li>
									<Link
										to={APP_ROUTES.PAGES.SHIPPING}
										className="hover:text-white transition-colors"
									>
										Shipping Info
									</Link>
								</li>
							</ul>
						</div>

						{/* Information */}
						<div>
							<h3 className="font-playfair text-white text-lg font-medium mb-4">
								Information
							</h3>
							<div className="space-y-4 text-sm leading-relaxed">
								<p>12 Rue des Jasmins, Casablanca, Morocco</p>
								<p>
									<a
										href={`mailto:${CONFIG.SUPPORT_EMAIL}`}
										className="hover:text-white underline decoration-dotted transition-colors"
									>
										{CONFIG.SUPPORT_EMAIL}
									</a>
								</p>
								<p>{CONFIG.SUPPORT_PHONE}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Divider */}
				<div className="border-t border-brand-800/50 my-8"></div>

				{/* Instagram Section */}
				<div className="pb-12">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
						<h3 className="font-playfair text-white text-xl font-medium">
							Follow Us on Instagram
						</h3>
						<a
							href="https://instagram.com/zamazor.ma"
							target="_blank"
							rel="noreferrer"
							className="text-sm font-medium hover:text-white transition-colors flex items-center gap-1"
						>
							@zamazor.ma
							<ArrowRightIcon className="h-3.5 w-3.5" />
						</a>
					</div>

					{/* 6-Image Instagram Grid */}
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
						{[
							{ img: cardImmune, alt: "Natural immunity ingredients" },
							{ img: cardMind, alt: "Fitness active routine" },
							{ img: cardNutrient, alt: "Cellular nutrition green bubbles" },
							{ img: heroProtein, alt: "Organic supplement pouch mockup" },
							{ img: heroRecovery, alt: "Facial serum skin care routine" },
							{ img: heroGreens, alt: "Effervescent supplement mix glass" },
						].map((item, index) => (
							<div
								key={index}
								className="aspect-square w-full rounded-2xl overflow-hidden relative group cursor-pointer bg-brand-950/70"
							>
								<img
									src={item.img}
									alt={item.alt}
									className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-brand-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
									<InstagramIcon className="h-6 w-6 text-white" />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Bottom Area: Social Icons & Legal Links */}
				<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pt-8 pb-8">
					{/* Social Links — only brand profiles that actually exist are
						linked (Instagram @zamazor.ma matches the Follow Us link above).
						Icons for platforms without a known brand handle are omitted so
						users aren't dropped onto unrelated platform homepages. */}
					<div className="flex items-center gap-3">
						{/* Instagram */}
						<a
							href="https://instagram.com/zamazor.ma"
							target="_blank"
							rel="noreferrer"
							className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-950/70 border border-brand-800/50 text-brand-200 hover:text-white hover:border-brand-600 transition-colors"
						>
							<InstagramIcon className="h-4 w-4" />
						</a>
					</div>

					{/* Legal Links */}
					<div className="flex flex-wrap items-center gap-6 text-sm font-medium">
						<Link
							to={APP_ROUTES.PAGES.ACCESSIBILITY}
							className="hover:text-white transition-colors"
						>
							Accessibility
						</Link>
						<Link
							to={APP_ROUTES.PAGES.TERMS}
							className="hover:text-white transition-colors"
						>
							Terms of Service
						</Link>
						<Link
							to={APP_ROUTES.PAGES.PRIVACY}
							className="hover:text-white transition-colors"
						>
							Privacy Policy
						</Link>
					</div>
				</div>

				{/* Footer Bottom: Copyright & Selector & Payment Badges */}
				<div className="border-t border-brand-800/50 pt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between text-xs text-brand-300">
					{/* Copyright */}
					<div>
						© {new Date().getFullYear()} Zamazor Clean Supplements. All
						rights reserved.
					</div>

					{/* Right Side Group: Selector & Payment Badges */}
					<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
						{/* Region Chip */}
						<div
							className="inline-flex items-center gap-2 rounded-full border border-brand-800/60 bg-brand-950/70 px-3 py-1.5 text-xs font-semibold text-brand-200"
							title={`${APP_COUNTRY} — Moroccan Dirham`}
						>
							<GlobeIcon className="size-3.5 text-accent" aria-hidden="true" />
							<span>{COUNTRY_CODE} · MAD</span>
							<span className="text-brand-300/80">
								· {language.toUpperCase()}
							</span>
						</div>

						{/* Payment Badges */}
						<div className="flex items-center gap-2 flex-wrap">
							{/* Visa */}
							<div className="h-6 w-9 rounded bg-[#1A1F71] flex items-center justify-center text-[10px] font-black text-white italic tracking-tighter">
								VISA
							</div>

							{/* Mastercard */}
							<div className="h-6 w-9 rounded bg-[#222222] flex items-center justify-center gap-0.5 relative overflow-hidden">
								<div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-90 absolute left-2"></div>
								<div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90 absolute right-2"></div>
							</div>

							{/* Amex */}
							<div className="h-6 w-9 rounded bg-[#0185FF] flex flex-col items-center justify-center text-[7px] font-black text-white leading-none">
								<span>AMER</span>
								<span>EXPR</span>
							</div>

							{/* PayPal */}
							<div className="h-6 w-9 rounded bg-[#003087] flex items-center justify-center text-[10px] font-bold text-white italic tracking-tighter">
								Pay<span className="text-[#009cde]">Pal</span>
							</div>

							{/* Diners Club */}
							<div className="h-6 w-9 rounded bg-[#0079C1] flex flex-col items-center justify-center text-[6px] font-black text-white leading-none">
								<span>DINERS</span>
								<span>CLUB</span>
							</div>

							{/* Discover */}
							<div className="h-6 w-9 rounded bg-[#FFFFFF] border border-[#CCCCCC] flex flex-col items-center justify-center text-[7px] font-extrabold text-[#F47521] leading-none">
								<span>DISC</span>
								<span>OVER</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
