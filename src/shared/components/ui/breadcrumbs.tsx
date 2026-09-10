/**
 * Lightweight breadcrumb trail. On mobile, trims the middle when there are
 * more than three items (first → … → last). Uses the brand token palette
 * throughout: `text-ink-faint` base, `text-brand-800` links, `text-ink`
 * for the current (non-linked) item.
 */
import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
	label: string;
	/** If omitted the item is rendered as the current (non-linked) page. */
	href?: string;
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[];
	className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
	const hasOverflow = items.length > 3;

	return (
		<nav aria-label="Breadcrumb" className={cn("text-xs", className)}>
			<ol className="flex flex-wrap items-center gap-1 text-ink-faint">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;
					const isFirst = index === 0;

					// Mobile: collapse middle items when > 3
					if (hasOverflow && !isFirst && !isLast) {
						if (index === 1) {
							return (
								<li key="ellipsis" className="flex items-center gap-1">
									<ChevronRightIcon className="size-3 shrink-0 text-ink-faint/50" />
									<span className="select-none" aria-hidden="true">
										…
									</span>
								</li>
							);
						}
						// Hide all other middle items
						return null;
					}

					return (
						<li key={item.label} className="flex items-center gap-1">
							{!isFirst && (
								<ChevronRightIcon className="size-3 shrink-0 text-ink-faint/50" />
							)}
							{item.href && !isLast ? (
								<Link
									to={item.href}
									className="font-medium text-ink-faint transition-colors hover:text-brand-800"
								>
									{item.label}
								</Link>
							) : (
								<span
									className={cn(
										"font-medium",
										isLast ? "text-ink" : "text-ink-faint",
									)}
								>
									{item.label}
								</span>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
};