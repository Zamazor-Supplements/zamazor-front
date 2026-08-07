import { motion } from "framer-motion";
import { SectionHeading } from "../shared/SectionHeading";
import CONFIG from "@/app/config/constants";

interface ProofStat {
	value: string;
	label: string;
}

interface ProofSectionProps {
	stats: ProofStat[];
}

export const ProofSection = ({ stats }: ProofSectionProps) => {
	return (
		<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
				{/* Left Column: Heading & Stats */}
				<div>
					<SectionHeading
						kicker="Built for trust"
						title="Wellness shopping should make the evidence easy to see."
						copy={`Instead of vague promises, ${CONFIG.APP_NAME} explains each formula through clean ingredient notes, routine guidance, quality checks, and proof points that help customers choose with confidence.`}
					/>
					<div className="mt-8 grid grid-cols-2 gap-3">
						{stats.map((stat) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 18 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.5 }}
								transition={{ duration: 0.45 }}
								className="rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-xs hover:border-emerald-900/20 transition-colors"
							>
								<p className="text-3xl font-black text-emerald-800">
									{stat.value}
								</p>
								<p className="mt-2 text-sm leading-snug text-slate-600 font-sans">
									{stat.label}
								</p>
							</motion.div>
						))}
					</div>
				</div>

				{/* Right Column: Before vs After Card */}
				<motion.div
					initial={{ opacity: 0, scale: 0.97 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true, amount: 0.35 }}
					transition={{ duration: 0.55, ease: "easeOut" }}
					className="overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/5"
				>
					<div className="grid sm:grid-cols-2">
						{/* Before */}
						<div className="bg-[#eff8e8] p-6 sm:p-8">
							<p className="text-xs font-black uppercase tracking-wider text-emerald-700">
								Before
							</p>
							<h3 className="mt-3 text-xl font-bold text-slate-950 leading-snug">
								Random supplements, unclear results.
							</h3>
							<ul className="mt-5 space-y-3 text-sm text-slate-600 font-sans">
								<li className="flex items-start gap-2">
									<span className="text-emerald-700">•</span> Multiple bottles
									with overlapping ingredients
								</li>
								<li className="flex items-start gap-2">
									<span className="text-emerald-700">•</span> No clear order for
									morning or training days
								</li>
								<li className="flex items-start gap-2">
									<span className="text-emerald-700">•</span> Hard to know what
									to reorder
								</li>
							</ul>
						</div>

						{/* After */}
						<div className="bg-emerald-950 p-6 sm:p-8 text-white">
							<p className="text-xs font-black uppercase tracking-wider text-lime-300">
								After
							</p>
							<h3 className="mt-3 text-xl font-bold leading-snug">
								A simple stack matched to your daily routine.
							</h3>
							<ul className="mt-5 space-y-3 text-sm text-emerald-100/80 font-sans">
								<li className="flex items-start gap-2">
									<span className="text-lime-400">•</span> Clear goals for
									energy, strength, and recovery
								</li>
								<li className="flex items-start gap-2">
									<span className="text-lime-400">•</span> Easy subscription
									controls
								</li>
								<li className="flex items-start gap-2">
									<span className="text-lime-400">•</span> Formula proof shown
									before checkout
								</li>
							</ul>
						</div>
					</div>

					{/* Footer Grid */}
					<div className="grid grid-cols-3 border-t border-emerald-900/10 bg-white text-center divide-x divide-emerald-900/10">
						{["Energy", "Strength", "Recovery"].map((label) => (
							<div key={label} className="p-4">
								<p className="text-xs sm:text-sm font-black text-emerald-900">
									{label}
								</p>
								<p className="mt-0.5 text-[11px] text-slate-500">
									routine support
								</p>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
};
