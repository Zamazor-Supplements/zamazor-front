import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
	kicker?: string;
	/** Renders the kicker as a frosted pill with an icon (used on story/help pages). */
	kickerIcon?: LucideIcon;
	title: string;
	description?: string;
	className?: string;
}

/**
 * Consolidated hero block for the static pages (shipping, returns, terms,
 * privacy, contact, faq, help, story, accessibility).
 */
export const PageHero = ({
	kicker,
	kickerIcon: KickerIcon,
	title,
	description,
	className,
}: PageHeroProps) => (
	<div
		className={cn(
			"relative overflow-hidden rounded-hero border border-brand-900/10 bg-linear-to-br from-brand-950 via-brand-900 to-slate-950 p-8 sm:p-14 text-white shadow-xl shadow-brand-950/10",
			className,
		)}
	>
		<div className="relative z-10 max-w-3xl">
			{kicker && (
				<p
					className={cn(
						"text-[11px] font-black uppercase tracking-[0.26em] text-accent",
						KickerIcon &&
							"inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-md",
					)}
				>
					{KickerIcon && <KickerIcon className="size-3.5" />}
					{kicker}
				</p>
			)}
			<h1 className="mt-3 font-playfair text-3xl font-normal leading-tight sm:text-5xl">
				{title}
			</h1>
			{description && (
				<p className="mt-4 text-sm leading-relaxed text-brand-100/80 sm:text-base">
					{description}
				</p>
			)}
		</div>

		{/* Ambient glow */}
		<div
			aria-hidden="true"
			className="pointer-events-none absolute -bottom-24 -right-24 size-96 rounded-full bg-lime-400/10 blur-3xl"
		/>
	</div>
);
