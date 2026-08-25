/**
 * Consistent empty-state block for the whole app (empty cart, empty wishlist,
 * no search results, empty dashboard cards, product not found, …).
 *
 * Follows the brand token system: dashed `brand-900/10` border, `surface-2`
 * fill, `ink` title and `ink-soft` description — the same visual language the
 * SalesChart empty state already uses.
 */
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
	/** Lucide icon rendered inside a soft circle. */
	icon: LucideIcon;
	title: string;
	description?: string;
	/** Optional action slot (e.g. a `<Button asChild><Link>`). */
	action?: ReactNode;
	/** Compact variant for small embedded surfaces (dropdowns, table cells). */
	compact?: boolean;
	className?: string;
}

export const EmptyState = ({
	icon: Icon,
	title,
	description,
	action,
	compact = false,
	className,
}: EmptyStateProps) => (
	<div
		className={cn(
			"flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-900/10 bg-surface-2/50 text-center",
			compact ? "gap-1.5 p-5" : "gap-2 p-8",
			className,
		)}
	>
		<div
			className={cn(
				"grid shrink-0 place-items-center rounded-full bg-surface-2 text-ink-faint",
				compact ? "size-9" : "size-14",
			)}
		>
			<Icon className={compact ? "size-4" : "size-7"} />
		</div>
		<h3
			className={cn(
				"font-semibold text-ink",
				compact ? "text-xs" : "text-base",
			)}
		>
			{title}
		</h3>
		{description && (
			<p
				className={cn(
					"leading-relaxed text-ink-soft",
					compact ? "text-[11px]" : "text-xs",
				)}
			>
				{description}
			</p>
		)}
		{action && <div className={compact ? "mt-1" : "mt-3"}>{action}</div>}
	</div>
);