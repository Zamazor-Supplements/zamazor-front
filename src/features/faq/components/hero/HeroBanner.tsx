import CONFIG from "@/app/config/constants";
import { SearchIcon } from "lucide-react";

export const HeroBanner = ({
	query,
	onChange,
}: {
	query: string;
	onChange: (q: string) => void;
}) => {
	return (
		<div className="relative overflow-hidden rounded-xl border border-brand-900/10 bg-linear-to-br from-brand-950 via-brand-900 to-slate-950 p-8 sm:p-14 text-white shadow-2xl shadow-brand-950/15">
			<div className="relative z-10 max-w-3xl">
				<div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 backdrop-blur-md border border-white/10">
					<span className="flex h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
					<span className="text-[11px] font-black uppercase tracking-[0.26em] text-lime-300">
						Help Center
					</span>
				</div>
				<h1 className="mt-4 text-4xl sm:text-6xl font-playfair font-normal leading-tight tracking-tight">
					Frequently Asked Questions
				</h1>
				<p className="mt-4 text-base sm:text-lg leading-relaxed text-brand-100/80 max-w-2xl font-normal">
					Find detailed answers on orders, shipping, payments, returns, and how{" "}
					{CONFIG.APP_NAME} supports your fitness routine.
				</p>

				{/* Live Search Bar */}
				<div className="mt-8 relative max-w-xl">
					<SearchIcon className="absolute left-4.5 top-1/2 -translate-y-1/2 size-5 text-brand-100/60 pointer-events-none" />
					<input
						type="text"
						value={query}
						onChange={(e) => onChange(e.target.value)}
						placeholder="Search questions (e.g. shipping, returns, payment)..."
						className="w-full rounded-lg bg-white/10 border border-white/15 pl-12 pr-4 py-4 text-sm text-white placeholder:text-brand-100/50 backdrop-blur-xl focus:bg-white focus:text-slate-950 focus:placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-lime-400/20 focus:border-lime-400 transition-all duration-300 shadow-inner"
					/>
				</div>
			</div>

			{/* Ambient Glows */}
			<div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-lime-400/15 blur-3xl pointer-events-none" />
			<div className="absolute top-0 right-1/4 size-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
		</div>
	);
};
