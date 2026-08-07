import { cn } from "@/lib/utils";
import { HeartIcon } from "lucide-react";
import type { MouseEvent } from "react";

interface WishlistToggleButtonProps {
	label: string;
	isFavorite: boolean;
	isPending: boolean;
	onClick: (e: MouseEvent<HTMLButtonElement>) => void;
	isAnimated?: boolean;
	className?: string;
}

export const WishlistToggleButton = ({
	label,
	isFavorite,
	isPending,
	onClick,
	className,
	isAnimated = true,
}: WishlistToggleButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isPending}
			aria-label={label}
			title={label}
			className={cn(
				"relative flex items-center justify-center cursor-pointer transition-colors disabled:opacity-50 bg-white/95 text-slate-700 shadow-sm border border-slate-100/80 hover:bg-rose-50/50 hover:border-rose-100 focus:outline-none focus:ring-2 focus:ring-emerald-800/20",
				isAnimated &&
					"transition-all duration-300 hover:scale-105 active:scale-75",
				isFavorite && "bg-rose-50/50 border-rose-100 text-rose-500",
				className,
			)}
		>
			{/* Background pulse ripple when favorited and animated */}
			{isAnimated && isFavorite && !isPending && (
				<span className="absolute inset-0 rounded-full bg-rose-400/20 animate-ping pointer-events-none" />
			)}
			{/*
			{isPending ? (
				<Loader2Icon className="size-4 animate-spin text-slate-400" />
			) : (
				<HeartIcon
					className={cn(
						"size-4 transition-colors",
						isAnimated && "transition-transform duration-300 transform",
						isFavorite
							? cn(
									"fill-rose-500 text-rose-500",
									isAnimated && "scale-110 animate-in zoom-in-50 duration-200",
								)
							: cn("text-slate-400", isAnimated && "hover:text-rose-600"),
					)}
				/>
			)}
			*/}
			<HeartIcon
				className={cn(
					"size-4 transition-colors",
					isAnimated && "transition-transform duration-300 transform",
					isFavorite
						? cn(
								"fill-rose-500 text-rose-500",
								isAnimated && "scale-110 animate-in zoom-in-50 duration-200",
							)
						: cn("text-slate-400", isAnimated && "hover:text-rose-600"),
				)}
			/>
		</button>
	);
};
