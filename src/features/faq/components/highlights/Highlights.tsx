import { HIGHLIGHTS } from "../../config/highlights";

export const Highlights = () => {
	return (
		<div className="grid gap-4 md:grid-cols-3">
			{HIGHLIGHTS.map((item) => {
				const Icon = item.icon;
				return (
					<div
						key={item.title}
						className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs transition-transform duration-200 hover:-translate-y-1"
					>
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<Icon className="size-6" />
						</div>
						<h2 className="mt-4 text-lg font-bold text-slate-950">
							{item.title}
						</h2>
						<p className="mt-1 text-sm leading-relaxed text-slate-500">
							{item.copy}
						</p>
					</div>
				);
			})}
		</div>
	);
};
