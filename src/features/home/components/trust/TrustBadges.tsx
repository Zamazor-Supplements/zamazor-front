import { sectionLift } from "@/shared/config/motion";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface IconLabelProps {
	icon: LucideIcon;
	label: string;
}

function IconLabel({ icon: Icon, label }: IconLabelProps) {
	return (
		<div className="flex items-center gap-3 text-sm font-semibold text-ink-soft">
			<span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-700">
				<Icon className="size-4" aria-hidden="true" />
			</span>
			{label}
		</div>
	);
}

interface TrustItem {
	label: string;
	icon: LucideIcon;
}

interface TrustBadgesProps {
	items: TrustItem[];
}

export const TrustBadges = ({ items }: TrustBadgesProps) => {
	return (
		<motion.section
						variants={sectionLift}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.16 }}
						transition={{ duration: 0.5, ease: "easeOut" }}
		 className="border-t border-brand-900/10 bg-card py-10">
			<div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
				{items.map((item) => (
					<IconLabel key={item.label} icon={item.icon} label={item.label} />
				))}
			</div>
		</motion.section>
	);
};
