import { APP_ROUTES } from "@/app/routes/paths";
import { cn } from "@/lib/utils";
import { HeartIcon } from "lucide-react";
import { Link } from "react-router";
import { useWishlistCount } from "../services/queries";

interface WishlistCountButtonProps {
	className?: string;
	onClick?: () => void;
	isMobile?: boolean;
}

export const WishlistCountButton = ({
	className,
	onClick,
	isMobile = false,
}: WishlistCountButtonProps) => {
	const count = useWishlistCount();
	const hasItems = count > 0;

	if (isMobile) {
		return (
			<Link
				to={APP_ROUTES.USER.WISHLIST}
				onClick={onClick}
				className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-900"
			>
				<span className="flex items-center gap-2.5 font-semibold">
					<HeartIcon
						className={cn(
							"size-4 transition-colors",
							hasItems ? "fill-rose-500 text-rose-500" : "text-emerald-850",
						)}
					/>
					Wishlist
				</span>
				{hasItems && (
					<span className="animate-in zoom-in-50 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-black text-white shadow-xs">
						{count > 99 ? "99+" : count}
					</span>
				)}
			</Link>
		);
	}

	return (
		<Link
			to={APP_ROUTES.USER.WISHLIST}
			aria-label={`Wishlist (${count} items)`}
			title="Wishlist"
			className={cn(
				"group relative flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition-all hover:bg-emerald-100/60 hover:text-emerald-900 active:scale-95",
				className,
			)}
		>
			<HeartIcon
				className={cn(
					"size-5 transition-transform duration-200 group-hover:scale-110",
					hasItems
						? "fill-rose-500 text-rose-500"
						: "text-slate-700 group-hover:text-emerald-900",
				)}
			/>
			{hasItems && (
				<span className="animate-in zoom-in-75 absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white shadow-xs ring-2 ring-white">
					{count > 99 ? "99+" : count}
				</span>
			)}
		</Link>
	);
};