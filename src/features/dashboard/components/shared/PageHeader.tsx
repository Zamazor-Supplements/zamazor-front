import type { ReactNode } from "react";

interface PageHeaderProps {
	eyebrow: ReactNode;
	title: string;
	description?: string;
	/** Optional right-aligned action slot (buttons, filters). */
	children?: ReactNode;
}

/** Shared dashboard page header: eyebrow kicker + title + description + action slot. */
export const PageHeader = ({
	eyebrow,
	title,
	description,
	children,
}: PageHeaderProps) => (
	<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
		<div className="space-y-1 min-w-0">
			<p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-800">
				{eyebrow}
			</p>
			<h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
				{title}
			</h2>
			{description && (
				<p className="max-w-2xl text-xs sm:text-sm text-ink-soft">
					{description}
				</p>
			)}
		</div>

		{children && (
			<div className="flex flex-wrap items-center gap-2 shrink-0">
				{children}
			</div>
		)}
	</div>
);
