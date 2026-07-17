import { useParams, useNavigate, Link } from "react-router";
import { useEffect } from "react";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import { APP_ROUTES } from "@/core/routes/paths";
import { Button } from "@/shared/components/ui/button";

import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { ProductDetails } from "@/features/products/components/productDetails";
import { ProductCard } from "@/features/products/components/ProductCard";
import { useAddToCart } from "@/services/cart/mutations";
import {
	useProductByIdQuery,
	useProductsByCategoryQuery,
} from "@/features/products/hooks/use-product";

export const ProductDetailPage = () => {
	const { id = "" } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { language } = useLanguage();
	const addItemMutation = useAddToCart();

	const { data: product, isPending } = useProductByIdQuery(id);
	const { data: productPage } = useProductsByCategoryQuery(
		product?.category.id,
	);

	useDocumentTitle(
		product
			? `${product.name} | Zamazor Clean Supplements`
			: `Product | Zamazor`,
	);

	// Scroll to top on load or product change
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [id]);

	const handleAddToCart = (productId: string, quantity = 1) => {
		addItemMutation.mutate({ productId, quantity });
	};

	if (isPending) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfdfa] p-4 text-center">
				<div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-900 border-t-transparent"></div>
				<p className="mt-4 text-slate-500 font-sans text-sm">
					Loading supplement stack details...
				</p>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfdfa] p-4 text-center">
				<h1 className="text-3xl font-playfair text-slate-900">
					Product not found
				</h1>
				<p className="mt-2 text-slate-500">
					We couldn't find the clean supplement formula you were looking for.
				</p>
				<Button
					asChild
					className="mt-6 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl"
				>
					<Link to={APP_ROUTES.HOME}>Return to home</Link>
				</Button>
			</div>
		);
	}

	// Generate cross-sell recommendations (different from the current product)
	const recommendations = productPage
		? productPage.items.filter((p) => p.id !== product.id).slice(0, 3)
		: [];

	return (
		<>
			{/* Main Product Area */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Back Button */}
				<button
					onClick={() => navigate(APP_ROUTES.HOME)}
					className="flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950 transition-colors mb-8 group cursor-pointer"
				>
					<ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
					Back to home
				</button>

				<ProductDetails product={product} addItem={handleAddToCart} />

				{/* Cross-Sell Recommendations */}
				<section className="mt-20 border-t border-emerald-900/10 pt-16">
					<div className="text-center mb-12">
						<p className="text-xs font-black uppercase tracking-widest text-emerald-700">
							{language === "fr"
								? "Perfectionnez votre stack"
								: "Perfect your stack"}
						</p>
						<h2 className="mt-2 text-3xl font-playfair font-normal tracking-tight text-slate-950 sm:text-4xl">
							{language === "fr"
								? "Complétez votre routine quotidienne."
								: "Complete your daily routine."}
						</h2>
						<p className="mt-3 max-w-xl mx-auto text-sm leading-relaxed text-slate-500">
							{language === "fr"
								? `Ces compléments s'associent parfaitement avec ${product.name} pour optimiser l'équilibre entre votre entraînement et votre récupération.`
								: `These supplementary blends pair beautifully with ${product.name} to optimize your training and recovery balance.`}
						</p>
					</div>

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{recommendations.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</section>
			</main>
		</>
	);
};
