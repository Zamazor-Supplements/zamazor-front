import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { PackageXIcon } from "lucide-react";
import { Link } from "react-router";

export const ProductNotFound = () => (
	<div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
		<div className="flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 shadow-inner">
			<PackageXIcon className="size-8" />
		</div>
		<h1 className="mt-4 font-playfair text-3xl font-semibold text-slate-900 sm:text-4xl">
			Product not found
		</h1>
		<p className="mt-2 max-w-md text-sm text-slate-500">
			We couldn't find the supplement formulation you were looking for. It may
			have been moved or removed.
		</p>
		<Button
			asChild
			className="mt-6 rounded-xl bg-emerald-900 px-6 py-2.5 text-white transition-colors hover:bg-emerald-950"
		>
			<Link to={APP_ROUTES.HOME}>Return to home</Link>
		</Button>
	</div>
);
