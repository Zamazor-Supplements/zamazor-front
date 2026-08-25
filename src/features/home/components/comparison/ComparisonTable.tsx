import { CheckIcon, XIcon } from "lucide-react";
import { SectionHeading } from "../shared/SectionHeading";
import CONFIG from "@/app/config/constants";
import { motion } from "framer-motion";
import { sectionLift } from "@/shared/config/motion";

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
		<motion.section
			variants={sectionLift}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.18 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
		>
			<div className="grid gap-10 rounded-3xl border border-brand-900/10 bg-card p-6 shadow-xl shadow-brand-950/5 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
				<div>
					<SectionHeading
						kicker="Compare clearly"
						title="Cleaner routines beat crowded cabinets."
						copy={`See how ${CONFIG.APP_NAME} simplifies your supplement stack compared to typical commercial vitamin stores.`}
					/>
					<div className="mt-8 space-y-4">
						<div className="flex items-start gap-3">
							<span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-800 mt-0.5">
								<CheckIcon className="size-3" />
							</span>
							<p className="text-sm text-ink-soft font-sans leading-relaxed">
								<strong className="text-ink">Scientifically dosed:</strong> No
								filler proprietary blends. You know exactly how many milligrams
								of every ingredient you ingest.
							</p>
						</div>
						<div className="flex items-start gap-3">
							<span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-800 mt-0.5">
								<CheckIcon className="size-3" />
							</span>
							<p className="text-sm text-ink-soft font-sans leading-relaxed">
								<strong className="text-ink">Zero artificial junk:</strong>{" "}
								Naturally sweetened, naturally colored, and easy on your
								digestion.
							</p>
						</div>
					</div>
				</div>

				{/* Comparison Matrix */}
				<div className="overflow-hidden rounded-xl border border-brand-900/10 shadow-xs">
					<div className="grid grid-cols-[1.2fr_1fr_1fr] bg-brand-950 text-xs sm:text-sm font-bold text-white items-center">
						<div className="p-4 sm:p-5">Feature</div>
						<div className="bg-brand-900/50 p-4 sm:p-5 text-center text-accent font-extrabold border-x border-white/10">
							{CONFIG.APP_NAME}
						</div>
						<div className="p-4 sm:p-5 text-center text-ink-faint">
							Typical store
						</div>
					</div>

					{data.map((row) => (
						<div
							key={row.feature}
							className="grid grid-cols-[1.2fr_1fr_1fr] border-t border-brand-900/10 text-xs sm:text-sm items-center hover:bg-surface-2/50 transition-colors"
						>
							<div className="p-4 sm:p-5 font-semibold text-ink leading-snug">
								{row.feature}
							</div>
							<div className="bg-brand-50/50 p-4 sm:p-5 text-brand-950 font-semibold border-x border-brand-900/5 h-full flex flex-col justify-center items-center text-center gap-1.5">
								<CheckIcon className="size-4 text-brand-700 bg-brand-100 rounded-full p-0.5 shrink-0" />
								<span className="text-[11px] sm:text-xs leading-tight text-brand-900 font-medium">
									{row.zamazor.text}
								</span>
							</div>
							<div className="p-4 sm:p-5 text-ink-soft h-full flex flex-col justify-center items-center text-center gap-1.5">
								<XIcon className="size-4 text-ink-faint bg-surface-2 rounded-full p-0.5 shrink-0" />
								<span className="text-[11px] sm:text-xs leading-tight text-ink-soft">
									{row.typical.text}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</motion.section>
	);
};
