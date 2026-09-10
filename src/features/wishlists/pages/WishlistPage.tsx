import { Link } from "react-router";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";
import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	HeartIcon,
	Trash2Icon,
} from "lucide-react";
import { useWishlist } from "../services/queries";
import { useClearWishlist } from "../services/mutations";
import { ProductCard } from "@/features/products/components/product/ProductCard";
import { WishlistPageSkeleton } from "../components/feedback/WishlistPageSkeleton";
import { WishlistPageError } from "../components/feedback/WishlistPageError";

export default function WishlistPage() {
	useDocumentTitle(`My Wishlist | ${CONFIG.APP_NAME}`);

	const { data: wishlistProducts, isPending, isError, refetch } = useWishlist();
	const clearWishlistMutation = useClearWishlist();

	const handleClearWishlist = () => {
		clearWishlistMutation.mutate();
	};

	if (isPending) {
		return <WishlistPageSkeleton />;
	}

	if (isError) {
		return <WishlistPageError onRefetch={() => refetch()} />;
	}

	const hasItems = (wishlistProducts?.length ?? 0) > 0;

	return (
		<div className="min-h-screen bg-[#fcfdfa] px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				{/* Header Section */}
				<div className="mb-8 flex flex-col justify-between gap-4 border-b border-brand-900/10 pb-6 sm:flex-row sm:items-end">
					<div>
						<Link
							to={APP_ROUTES.SHOP}
							className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-brand-800 transition-colors hover:text-brand-950"
						>
							<ArrowLeftIcon className="size-3.5" />
							Back to shopping
						</Link>
						<h1 className="font-playfair text-3xl font-normal text-slate-950 sm:text-4xl">
							My Wishlist
						</h1>
						<p className="mt-1 text-sm text-slate-500">
							Save and manage your favorite wellness formulas.
						</p>
					</div>

					{hasItems && (
						<Button
							variant="ghost"
							onClick={handleClearWishlist}
							disabled={clearWishlistMutation.isPending}
							className="h-10 cursor-pointer rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
						>
							<Trash2Icon className="mr-1.5 size-4" />
							{clearWishlistMutation.isPending ? "Clearing..." : "Clear All"}
						</Button>
					)}
				</div>

				{/* Content Grid */}
				{!hasItems ? (
					<div className="mx-auto max-w-md py-12">
						<EmptyState
							icon={HeartIcon}
							title="Your wishlist is empty"
							description="Explore our targeted supplement stacks and save your favorites here."
							action={<Button
								asChild
								className="h-11 rounded-lg bg-brand-900 px-5 text-white hover:bg-brand-950"
							>
								<Link to={APP_ROUTES.SHOP}>
									Browse Formulas
									<ArrowRightIcon className="ml-1.5 size-4" />
								</Link>
							</Button>} />
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{wishlistProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
