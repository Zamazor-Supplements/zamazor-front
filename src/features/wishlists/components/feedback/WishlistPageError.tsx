import { Button } from "@/shared/components/ui/button";
import { AlertCircleIcon } from "lucide-react";

export function WishlistPageError({
	onRefetch,
}: {
	onRefetch: () => void;
}) {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
			<AlertCircleIcon className="size-12 text-rose-500" />
			<h2 className="mt-4 font-playfair text-2xl font-bold text-slate-900">
				Failed to load wishlist
			</h2>
			<p className="mt-2 text-sm text-slate-500">
				Something went wrong while fetching your favorites.
			</p>
			<Button
				onClick={onRefetch}
				className="mt-6 rounded-xl bg-emerald-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-950"
			>
				Try Again
			</Button>
		</div>
	);
}
