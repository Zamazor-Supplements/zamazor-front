import { HIGHLIGHTS } from "../../config/highlights";

export const Highlights = () => {
	return (
		<div className="grid gap-6 md:grid-cols-3">
			{HIGHLIGHTS.map((item) => {
				const Icon = item.icon;
				return (
					<div
						key={item.title}
						className="group relative overflow-hidden rounded-xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-950/5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-900/20 hover:shadow-2xl hover:shadow-slate-950/10"
					>
						<div className="absolute top-0 right-0 -mt-8 -mr-8 size-32 rounded-full bg-brand-50/50 blur-2xl transition-all group-hover:bg-brand-100/60 pointer-events-none" />
						<div className="relative z-10">
							<div className="grid size-12 place-items-center rounded-lg bg-brand-50 text-brand-800 shadow-xs transition-transform duration-300 group-hover:scale-110">
								<Icon className="size-6" />
							</div>
							<h2 className="mt-5 text-lg font-playfair font-normal tracking-tight text-slate-950">
								{item.title}
							</h2>
							<p className="mt-2 text-sm leading-relaxed text-slate-500">
								{item.copy}
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
};
