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
		<div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-900/10 bg-linear-to-br from-emerald-950 via-emerald-900 to-slate-950 p-8 sm:p-12 text-white shadow-xl shadow-emerald-950/10">
			<div className="relative z-10 max-w-3xl">
				<p className="text-[11px] font-black uppercase tracking-[0.26em] text-lime-400">
					Help Center
				</p>
				<h1 className="mt-3 text-3xl sm:text-5xl font-playfair font-normal leading-tight tracking-tight">
					Frequently Asked Questions
				</h1>
				<p className="mt-4 text-sm sm:text-base leading-relaxed text-emerald-100/80">
					Find detailed answers on orders, shipping, payments, returns, and how{" "}
					{CONFIG.APP_NAME} supports your fitness routine.
				</p>

				{/* Live Search Bar */}
				<div className="mt-8 relative max-w-xl">
					<SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
					<input
						type="text"
						value={query}
						onChange={(e) => onChange(e.target.value)}
						placeholder="Search questions (e.g. shipping, returns, payment)..."
						className="w-full rounded-2xl bg-white/10 border border-white/15 pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-emerald-100/50 backdrop-blur-md focus:bg-white focus:text-slate-950 focus:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all duration-200"
					/>
				</div>
			</div>

			{/* Ambient Glow */}
			<div className="absolute -bottom-20 -right-20 size-80 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
		</div>
	);
};
