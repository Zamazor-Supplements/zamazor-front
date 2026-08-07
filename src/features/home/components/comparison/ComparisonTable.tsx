import { CheckIcon, XIcon } from "lucide-react";
import { SectionHeading } from "../shared/SectionHeading";
import CONFIG from "@/app/config/constants";

interface ComparisonRow {
	feature: string;
	zamazor: { text: string };
	typical: { text: string };
}

interface ComparisonTableProps {
	data: ComparisonRow[];
}

export const ComparisonTable = ({ data }: ComparisonTableProps) => {
	return (
		<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div className="grid gap-10 rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-950/5 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
				<div>
					<SectionHeading
						kicker="Compare clearly"
						title="Cleaner routines beat crowded cabinets."
						copy={`See how ${CONFIG.APP_NAME} simplifies your supplement stack compared to typical commercial vitamin stores.`}
					/>
					<div className="mt-8 space-y-4">
						<div className="flex items-start gap-3">
							<span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800 mt-0.5">
								<CheckIcon className="size-3" />
							</span>
							<p className="text-sm text-slate-600 font-sans leading-relaxed">
								<strong className="text-slate-900">
									Scientifically dosed:
								</strong>{" "}
								No filler proprietary blends. You know exactly how many
								milligrams of every ingredient you ingest.
							</p>
						</div>
						<div className="flex items-start gap-3">
							<span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800 mt-0.5">
								<CheckIcon className="size-3" />
							</span>
							<p className="text-sm text-slate-600 font-sans leading-relaxed">
								<strong className="text-slate-900">
									Zero artificial junk:
								</strong>{" "}
								Naturally sweetened, naturally colored, and easy on your
								digestion.
							</p>
						</div>
					</div>
				</div>

				{/* Comparison Matrix */}
				<div className="overflow-hidden rounded-2xl border border-emerald-900/10 shadow-xs">
					<div className="grid grid-cols-[1.2fr_1fr_1fr] bg-slate-950 text-xs sm:text-sm font-bold text-white items-center">
						<div className="p-4 sm:p-5">Feature</div>
						<div className="bg-emerald-900/50 p-4 sm:p-5 text-center text-lime-300 font-extrabold border-x border-white/10">
							{CONFIG.APP_NAME}
						</div>
						<div className="p-4 sm:p-5 text-center text-slate-400">
							Typical store
						</div>
					</div>

					{data.map((row) => (
						<div
							key={row.feature}
							className="grid grid-cols-[1.2fr_1fr_1fr] border-t border-emerald-900/10 text-xs sm:text-sm items-center hover:bg-slate-50/50 transition-colors"
						>
							<div className="p-4 sm:p-5 font-semibold text-slate-900 leading-snug">
								{row.feature}
							</div>
							<div className="bg-emerald-50/50 p-4 sm:p-5 text-emerald-950 font-semibold border-x border-emerald-900/5 h-full flex flex-col justify-center items-center text-center gap-1.5">
								<CheckIcon className="size-4 text-emerald-700 bg-emerald-100 rounded-full p-0.5 shrink-0" />
								<span className="text-[11px] sm:text-xs leading-tight text-emerald-900 font-medium">
									{row.zamazor.text}
								</span>
							</div>
							<div className="p-4 sm:p-5 text-slate-500 h-full flex flex-col justify-center items-center text-center gap-1.5">
								<XIcon className="size-4 text-slate-400 bg-slate-100 rounded-full p-0.5 shrink-0" />
								<span className="text-[11px] sm:text-xs leading-tight text-slate-500">
									{row.typical.text}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
