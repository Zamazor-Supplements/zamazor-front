import { APP_ROUTES } from "@/app/routes/paths";
import { ArrowLeftIcon, LockIcon } from "lucide-react";
import { Link } from "react-router";
import logo from "@/assets/images/zamazor.svg";
import CONFIG from "@/app/config/constants";

export const CheckoutHeader = () => {
	return (
		<header className="mx-auto mt-2 w-[calc(100%-2rem)] max-w-7xl rounded-2xl border border-emerald-900/10 bg-[#f7fbf3]/90 shadow-md backdrop-blur p-4 flex items-center justify-between">
			<Link
				to={APP_ROUTES.CART}
				className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950"
			>
				<ArrowLeftIcon className="size-4" />
				Cart
			</Link>
			<Link to={APP_ROUTES.SHOP} className="flex items-center gap-2">
				<img
					src={logo}
					alt={CONFIG.APP_NAME}
					className="size-9 rounded-lg border border-emerald-900/10 bg-white"
				/>
				<span className="text-lg font-black tracking-normal text-emerald-950">
					{CONFIG.APP_NAME}
				</span>
			</Link>
			<div className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm font-bold">
				<LockIcon className="size-4 text-emerald-700" />
				<span className="hidden sm:inline">Secure checkout</span>
			</div>
		</header>
	);
};
