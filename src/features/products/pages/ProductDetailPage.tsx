import { useParams, useNavigate } from "react-router";
import { useEffect } from "react";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import { APP_ROUTES } from "@/app/routes/paths";

import { ArrowLeftIcon } from "lucide-react";
import { ProductDetails } from "@/features/products/components/product/ProductDetails";
import { StickyAddToCartBar } from "@/features/products/components/product/StickyAddToCartBar";
import { ProductCard } from "@/features/products/components/product/ProductCard";
import {
	useProduct,
	useProductsByCategory,
} from "@/features/products/services/product/queries";
import CONFIG from "@/app/config/constants";
import { ProductNotFound } from "@/features/products/components/product/ProductNotFound";
import { ProductDetailSkeleton } from "@/features/products/components/skeleton/ProductDetailSkeleton";
import { Breadcrumbs } from "@/shared/components/ui/breadcrumbs";
import { useRecentlyViewedStore } from "@/shared/hooks/use-recently-viewed";

export default function ProductDetailPage() {
	const { id = "" } = useParams<{ id: string; }>();
	const navigate = useNavigate();

	// Primary Query for Main Product Data
	const { data: product, isPending, isError } = useProduct(id);

	// Secondary Query for Cross-Sells (Failures here will be gracefully ignored)
	const { data: productPage, isPending: isCategoryPending } = useProductsByCategory(product?.category.id);

	// Dynamic Document Title
	useDocumentTitle(
		product
			? `${product.name} | ${CONFIG.APP_NAME}`
			: `Product | ${CONFIG.APP_NAME}`
	);

	// Scroll to top on load or product change, and record the view for the
	// homepage "Recently viewed" rail (read-only via getState, no re-render).
	useEffect(() => {
		window.scrollTo(0, 0);
		useRecentlyViewedStore.getState().trackProduct(id);
	}, [id]);

	// Derived Recommendations Memoized
	const recommendations = productPage?.items && product?.id
		? productPage.items.filter((item) => item?.id !== product.id).slice(0, 3)
		: [];

	if (isPending) return <ProductDetailSkeleton />;
	if (!product || isError) return <ProductNotFound />;

	return (
		<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			{/* Breadcrumbs */}
			<Breadcrumbs
				items={[
					{ label: "Home", href: APP_ROUTES.HOME },
					{ label: "Shop", href: APP_ROUTES.SHOP },
					{ label: product.name },
				]}
				className="mb-4" />

			{/* Back Navigation */}
			<button
				type="button"
				onClick={() => navigate(APP_ROUTES.HOME)}
				className="group mb-8 flex items-center gap-2 text-sm font-semibold text-brand-800 transition-colors hover:text-brand-950 cursor-pointer"
			>
				<ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-1" />
				Back to home
			</button>

			{/* Main Product Info Component */}
			<ProductDetails product={product} />

			{/* Mobile sticky add-to-cart bar (below the fold, < lg) */}
			<StickyAddToCartBar product={product} />

			{/* Cross-Sell Recommendations Section (Renders only if items exist) */}
			{(recommendations.length > 0 || isCategoryPending) && (
				<section className="mt-20 border-t border-brand-900/10 pt-16">
					<div className="mb-12 text-center">
						<p className="text-xs font-black uppercase tracking-widest text-brand-700">
							Perfect your stack
						</p>
						<h2 className="mt-2 font-playfair text-3xl font-normal tracking-tight text-slate-950 sm:text-4xl">
							Complete your daily routine.
						</h2>
						<p className="mt-3 max-w-xl mx-auto text-sm leading-relaxed text-slate-500">
							These supplementary blends pair beautifully with {product.name} to
							optimize your training and recovery balance.
						</p>
					</div>

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{recommendations.map((recProduct) => (
							<ProductCard key={recProduct.id} product={recProduct} />
						))}
					</div>
				</section>
			)}
		</main>
	);
}
