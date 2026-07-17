import { Link, useNavigate } from "react-router";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/core/config/constants";
import { APP_ROUTES } from "@/core/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { OriginButton } from "@/shared/components/ui/origin-button";
import {
	Heart,
	ShoppingBag,
	Trash2,
	ArrowLeft,
	ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { type MouseEvent } from "react";

import { useLanguage } from "@/shared/context/LanguageContext";
import { useAddToCart } from "@/services/cart/mutations";
import {
	useClearWishlist,
	useToggleWishlist,
	useWishlist,
} from "@/features/wishlists/hooks/use-wishlist";

export const WishlistPage = () => {
	const { language, t } = useLanguage();
	useDocumentTitle(
		`${language === "fr" ? "Mes Favoris" : "My Wishlist"} | ${CONFIG.APP_NAME}`,
	);
	const navigate = useNavigate();

	const { data: wishlistProducts, isPending, isError } = useWishlist();
	const toggleToWishlistMutation = useToggleWishlist();
	const clearWishlistMutation = useClearWishlist();
	const addToCartMutation = useAddToCart();

	const handleAddToCart = (productId: string, e: MouseEvent) => {
		e.stopPropagation();
		addToCartMutation.mutate({ productId, quantity: 1 });
	};

	const handleToggle = (productId: string, e: MouseEvent) => {
		e.stopPropagation();
		toggleToWishlistMutation.mutate(productId);
	};

	const handleClearWishlist = () => {
		clearWishlistMutation.mutate();
	};

	if (isPending) return <div>Loading wishlist...</div>;
	if (isError) return <div>Error loading wishlist.</div>;

	return (
		<div className="min-h-screen bg-[#fcfdfa] py-12 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				{/* Header Section */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-emerald-900/10 pb-6 mb-8">
					<div>
						<Link
							to={APP_ROUTES.SHOP}
							className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 mb-3"
						>
							<ArrowLeft className="size-3.5" />
							{language === "fr" ? "Retour aux achats" : "Back to shopping"}
						</Link>
						<h1 className="text-3xl sm:text-4xl font-playfair font-normal text-slate-950">
							{language === "fr" ? "Mes Favoris" : "My Wishlist"}
						</h1>
						<p className="text-sm text-slate-500 mt-1">
							{language === "fr"
								? "Enregistrez et gérez vos formules bien-être préférées."
								: "Save and manage your favorite wellness formulas."}
						</p>
					</div>

					{wishlistProducts.length > 0 && (
						<Button
							variant="ghost"
							onClick={handleClearWishlist}
							className="h-10 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl cursor-pointer"
						>
							<Trash2 className="size-4 mr-1.5" />
							{language === "fr" ? "Tout Effacer" : "Clear All"}
						</Button>
					)}
				</div>

				{/* Content Grid */}
				{wishlistProducts.length === 0 ? (
					<div className="text-center py-20 bg-white rounded-[2rem] border border-emerald-900/5 p-8 max-w-md mx-auto shadow-xs">
						<span className="grid size-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-900/30 mx-auto mb-5">
							<Heart className="size-8" />
						</span>
						<h3 className="text-xl font-playfair text-slate-950">
							{language === "fr"
								? "Votre liste de favoris est vide"
								: "Your wishlist is empty"}
						</h3>
						<p className="mt-2 text-sm text-slate-500">
							{language === "fr"
								? "Explorez nos compléments ciblés et enregistrez vos favoris ici."
								: "Explore our targeted supplement stacks and save your favorites here."}
						</p>
						<Button
							asChild
							className="mt-6 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl h-11 px-5"
						>
							<Link to={APP_ROUTES.SHOP}>
								{language === "fr"
									? "Parcourir les Formules"
									: "Browse Formulas"}
								<ArrowRight className="size-4 ml-1.5" />
							</Link>
						</Button>
					</div>
				) : (
					<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{wishlistProducts.map((product) => (
							<motion.article
								key={product.id}
								whileHover={{ y: -6 }}
								transition={{ duration: 0.12, ease: "easeOut" }}
								onClick={() => navigate(`/product/${product.id}`)}
								className="rounded-[2rem] border border-emerald-950/5 bg-white p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer relative"
							>
								{/* Heart Button Overlay */}
								<button
									onClick={(e) => handleToggle(product.id, e)}
									className="absolute right-6 top-6 z-10 size-9 rounded-full bg-white/95 text-rose-500 shadow-sm border border-slate-100 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
									title="Remove from Wishlist"
								>
									<Heart className="size-4.5 fill-rose-500 text-rose-500" />
								</button>

								<div>
									{/* Image container */}
									<div className="relative h-64 overflow-hidden rounded-[1.5rem] bg-white border border-gray-100/60">
										<img
											src={product.imageUrl}
											alt={product.name}
											className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-103"
										/>
									</div>

									{/* Text details */}
									<div className="mt-4 px-1">
										<p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
											{product.category.label}
										</p>
										<h3 className="mt-1 text-lg font-playfair font-semibold leading-snug text-slate-950 line-clamp-1">
											{product.name}
										</h3>
									</div>
								</div>

								{/* CTA Action */}
								<OriginButton
									variant="emerald"
									onClick={(e) => handleAddToCart(product.id, e)}
									className="mt-5 w-full h-10 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
								>
									<ShoppingBag className="size-3.5" />
									{t("common.addToCart")}
								</OriginButton>
							</motion.article>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
