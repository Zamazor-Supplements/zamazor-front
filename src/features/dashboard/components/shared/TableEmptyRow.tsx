import type { LucideIcon } from "lucide-react";

type TableEmptyRowProps = {
	colSpan: number;
	icon: LucideIcon;
	title: string;
	description: string;
};

export const TableEmptyRow = ({
	colSpan,
	icon: Icon,
	title,
	description,
}: TableEmptyRowProps) => (
	<tr>
		<td colSpan={colSpan} className="px-6 py-16 text-center">
			<div className="mx-auto flex max-w-xs flex-col items-center gap-2">
				<div className="flex size-12 items-center justify-center rounded-full bg-surface-2 text-ink-faint">
					<Icon className="size-6" />
				</div>
				<p className="text-sm font-medium text-ink">{title}</p>
				<p className="text-xs text-ink-soft">{description}</p>
			</div>
		</td>
	</tr>
);
