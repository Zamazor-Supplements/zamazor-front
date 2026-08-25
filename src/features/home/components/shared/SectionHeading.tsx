import { fadeUp } from "@/shared/config/motion";
import { motion } from "framer-motion";

interface SectionHeadingProps {
	kicker: string;
	title: string;
	copy?: string;
}

export function SectionHeading({ kicker, title, copy }: SectionHeadingProps) {
	return (
		<motion.div
			variants={fadeUp}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.4 }}
			transition={{ duration: 0.32, ease: "easeOut" }}
			className="max-w-3xl"
		>
			<p className="text-sm font-bold uppercase text-brand-700">{kicker}</p>
			<h2 className="mt-2 text-3xl font-playfair font-normal leading-tight tracking-normal text-ink sm:text-4xl">
				{title}
			</h2>
			{copy && (
				<p className="mt-4 text-base leading-7 text-ink-soft">{copy}</p>
			)}
		</motion.div>
	);
}
