import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
	rating: number;
	count?: number;
	size?: number;
	showValue?: boolean;
	className?: string;
}

/**
 * Star rating with fractional fill (gold overlay clipped to rating/5).
 * Exposed to assistive tech via role="img" + aria-label.
 */
export const RatingStars = ({
	rating,
	count,
	size = 16,
	showValue = false,
	className,
}: RatingStarsProps) => {
	const clamped = Math.max(0, Math.min(5, rating));
	const stars = Array.from({ length: 5 }, (_, i) => (
		<StarIcon
			key={i}
			width={size}
			height={size}
			className="shrink-0"
			strokeWidth={1.5}
		/>
	));

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<span
				role="img"
				aria-label={`Rated ${clamped.toFixed(1)} out of 5 stars`}
				className="relative inline-flex"
			>
				<span className="flex text-ink-faint/40">{stars}</span>
				<span
					aria-hidden="true"
					className="absolute inset-y-0 left-0 flex overflow-hidden text-gold"
					style={{ width: `${(clamped / 5) * 100}%` }}
				>
					{stars}
				</span>
			</span>
			{showValue && (
				<span className="text-xs font-bold text-ink-soft">
					{clamped.toFixed(1)}
					{count !== undefined ? ` (${count} reviews)` : ""}
				</span>
			)}
		</div>
	);
};
