import type { LucideIcon } from "lucide-react";

interface IconLabelProps {
	icon: LucideIcon;
	label: string;
}

function IconLabel({ icon: Icon, label }: IconLabelProps) {
	return (
		<div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
			<span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
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
		<section className="border-t border-emerald-900/10 bg-white py-10">
			<div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
				{items.map((item) => (
					<IconLabel key={item.label} icon={item.icon} label={item.label} />
				))}
			</div>
		</section>
	);
};
