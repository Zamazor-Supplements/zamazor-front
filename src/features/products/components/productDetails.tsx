import {
	CompassIcon,
	HeartIcon,
	LeafIcon,
	ShieldCheckIcon,
	ShoppingBagIcon,
	SparklesIcon,
	StarIcon,
} from "lucide-react";
import type { Product } from "../schemas/productSchema";
import { useState } from "react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { cn } from "@/lib/utils";
import { OriginButton } from "@/shared/components/ui/origin-button";
import { Button } from "@/shared/components/ui/button";
import {
	useIsWishlistItem,
	useToggleWishlist,
} from "@/features/wishlists/hooks/use-wishlist";

export const ProductDetails = ({
	product,
	addItem,
}: {
	product: Product;
	addItem: (productId: string, quantity: number) => void;
}) => {
	const [activeTab, setActiveTab] = useState<
		"usage" | "ingredients" | "science"
	>("usage");
	const [quantity, setQuantity] = useState(1);
	const toggleToWishlistMutation = useToggleWishlist();
	const isFavorite = useIsWishlistItem(product.id);
	const { language, t } = useLanguage();

	return (
		<div className="grid gap-12 lg:grid-cols-2 lg:items-start">
			{/* Left Column: Visual Container */}
			<div className="space-y-6">
				<div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-emerald-950/5 bg-white p-8 flex items-center justify-center shadow-lg shadow-emerald-950/5 group">
					<span className="absolute left-6 top-6 z-10 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-900 border border-emerald-900/10 shadow-xs">
						{product.category.label}
					</span>

					<button
						type="button"
						onClick={() => void toggleToWishlistMutation.mutate(product.id)}
						className="absolute right-6 top-6 z-10 size-10 rounded-full bg-white flex items-center justify-center border border-emerald-950/5 shadow-xs hover:scale-105 transition-all text-slate-400 hover:text-rose-500 cursor-pointer"
						title={
							isFavorite
								? language === "fr"
									? "Retirer des favoris"
									: "Remove from Wishlist"
								: language === "fr"
									? "Ajouter aux favoris"
									: "Add to Wishlist"
						}
					>
						<HeartIcon
							className={cn(
								"size-5 transition-colors",
								isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-400",
							)}
						/>
					</button>

					<img
						src={product.imageUrl}
						alt={product.name}
						className="h-4/5 w-4/5 object-contain transition-transform duration-300 group-hover:scale-105"
					/>
				</div>

				{/* Feature highlights grid */}
				<div className="grid grid-cols-3 gap-3">
					<div className="rounded-2xl border border-emerald-900/5 bg-white p-4 text-center shadow-xs">
						<ShieldCheckIcon className="size-5 text-emerald-700 mx-auto" />
						<p className="mt-2 text-xs font-extrabold text-slate-900 uppercase tracking-wide">
							{language === "fr" ? "Testé par Tiers" : "3rd Party Tested"}
						</p>
						<p className="text-[10px] text-slate-500 mt-0.5">
							{language === "fr"
								? "Pureté vérifiée en labo"
								: "Lab verified purity"}
						</p>
					</div>
					<div className="rounded-2xl border border-emerald-900/5 bg-white p-4 text-center shadow-xs">
						<LeafIcon className="size-5 text-emerald-700 mx-auto" />
						<p className="mt-2 text-xs font-extrabold text-slate-900 uppercase tracking-wide">
							{language === "fr" ? "100% Propre" : "100% Clean"}
						</p>
						<p className="text-[10px] text-slate-500 mt-0.5">
							{language === "fr"
								? "Sans colorants artificiels"
								: "No artificial colors"}
						</p>
					</div>
					<div className="rounded-2xl border border-emerald-900/5 bg-white p-4 text-center shadow-xs">
						<SparklesIcon className="size-5 text-emerald-700 mx-auto" />
						<p className="mt-2 text-xs font-extrabold text-slate-900 uppercase tracking-wide">
							{language === "fr" ? "Dose Optimale" : "Optimal Dose"}
						</p>
						<p className="text-[10px] text-slate-500 mt-0.5">
							{language === "fr"
								? "Haute biodisponibilité"
								: "High bioavailability"}
						</p>
					</div>
				</div>
			</div>

			{/* Right Column: Product Detail details */}
			<div className="flex flex-col justify-between">
				<div>
					<p className="text-xs font-black uppercase tracking-widest text-emerald-700">
						{product.category.label}
					</p>
					<h1 className="mt-2 text-4xl font-playfair font-normal leading-none text-slate-950 sm:text-5xl">
						{product.name}
					</h1>

					{/* Rating details */}
					<div className="mt-4 flex items-center gap-2">
						<div className="flex text-amber-400">
							{Array.from({ length: 5 }).map((_, i) => (
								<StarIcon key={i} className="size-4 fill-current" />
							))}
						</div>
						<span className="text-xs font-bold text-slate-500">
							4.9 (184 {language === "fr" ? "avis" : "reviews"})
						</span>
					</div>

					<div className="mt-6 flex items-baseline gap-4">
						<span className="text-3xl font-black text-slate-950">
							{product.price} MAD
						</span>
						<span className="text-sm font-semibold text-slate-500">
							{language === "fr"
								? "Livraison gratuite incluse"
								: "Free shipping included"}
						</span>
					</div>

					<p className="mt-6 text-sm sm:text-base leading-relaxed text-slate-600 font-sans">
						{product.description}
					</p>

					{/* Stacking routine advisory box */}
					<div className="mt-8 rounded-2xl bg-[#f0f7ec] border border-emerald-900/10 p-5 flex items-start gap-4">
						<CompassIcon className="size-6 text-emerald-800 mt-0.5 shrink-0" />
						<div>
							<h4 className="text-sm font-bold text-emerald-950 font-sans">
								{language === "fr"
									? "Fenêtre Journalière Optimale"
									: "Optimal Daily Window"}
							</h4>
							<p className="text-xs text-slate-600 mt-1 font-sans leading-relaxed">
								{product.category.label.includes("Recovery")
									? language === "fr"
										? "Consommer Night Repair 30-45 minutes avant le coucher favorise une récupération plus profonde et régénère les tissus musculaires pendant la nuit."
										: "Consuming Night Repair 30-45 minutes before bedtime encourages deeper recovery and resets muscle tissue cell growth overnight."
									: product.category.label.includes("Protein")
										? language === "fr"
											? "Prendre dans les 45 minutes suivant l'entraînement pour réparer les fibres musculaires, ou l'utiliser comme collation pour stimuler l'énergie métabolique."
											: "Take within 45 minutes of training to build muscle fibers, or use as a mid-day meal supplement to boost metabolic energy."
										: product.category.label.includes("Greens")
											? language === "fr"
												? "Consommer le matin à jeun pour améliorer la santé du microbiote intestinal et les voies enzymatiques digestives naturelles."
												: "Consume first thing in the morning on an empty stomach to enhance gut biome health and natural digestive enzyme pathways."
											: language === "fr"
												? "Siroter pendant les cycles d'entraînement ou les fenêtres de concentration pour maintenir l'hydratation, le flux sanguin et des niveaux minéraux constants."
												: "Sip throughout workout cycles or focus windows to maintain hydration, blood flow, and sustained mineral levels."}
							</p>
						</div>
					</div>

					{/* Quantity and Add to Cart */}
					<div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center border-t border-emerald-900/5 pt-8">
						<div className="flex items-center self-start sm:self-auto rounded-xl border border-emerald-900/15 bg-white p-1">
							<button
								onClick={() => setQuantity(Math.max(1, quantity - 1))}
								className="size-9 font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center hover:bg-slate-50 rounded-lg cursor-pointer"
							>
								-
							</button>
							<span className="w-12 text-center text-sm font-bold text-slate-900 select-none">
								{quantity}
							</span>
							<button
								onClick={() => setQuantity(quantity + 1)}
								className="size-9 font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center hover:bg-slate-50 rounded-lg cursor-pointer"
							>
								+
							</button>
						</div>

						<div className="flex-1 flex gap-3">
							<OriginButton
								variant="emerald"
								onClick={() => {
									addItem(product.id, quantity);
								}}
								className="flex-1 h-12 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
							>
								<ShoppingBagIcon className="size-4" />
								{t("common.addToCart")} &bull;{" "}
								{product && typeof product.price === "string"
									? `${(product.price * quantity).toFixed(2)} MAD`
									: ""}
							</OriginButton>

							{product && (
								<Button
									type="button"
									variant="outline"
									onClick={() =>
										void toggleToWishlistMutation.mutate(product.id)
									}
									className="size-12 rounded-xl border-emerald-900/10 text-slate-700 hover:bg-rose-50/50 hover:text-rose-600 hover:border-rose-100 flex items-center justify-center cursor-pointer transition-colors shadow-sm"
									title={
										isFavorite
											? language === "fr"
												? "Retirer des favoris"
												: "Remove from Wishlist"
											: language === "fr"
												? "Ajouter aux favoris"
												: "Add to Wishlist"
									}
								>
									<HeartIcon
										className={cn(
											"size-5 transition-colors",
											isFavorite
												? "fill-rose-500 text-rose-500"
												: "text-slate-500",
										)}
									/>
								</Button>
							)}
						</div>
					</div>

					{/* Key Benefits */}
					{/* <div className="mt-8">
						<h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
							{t("shop.benefits")}
						</h3>
						<ul className="mt-3 space-y-2.5">
							{product.benefits?.map((benefit) => (
										<li key={benefit} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
											<span className="grid size-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800 mt-0.5">
												<Check className="size-2.5" />
											</span>
											<span>{benefit}</span>
										</li>
									))}
						</ul>
					</div> */}
				</div>

				{/* Interactive Tabs bar */}
				<div className="mt-10 border-t border-emerald-900/5 pt-8">
					<div className="flex border-b border-emerald-900/10 gap-6">
						{(["usage", "ingredients", "science"] as const).map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={cn(
									"pb-3 text-xs sm:text-sm font-black uppercase tracking-wider border-b-2 -mb-0.5 transition-all cursor-pointer",
									activeTab === tab
										? "border-emerald-800 text-emerald-900"
										: "border-transparent text-slate-400 hover:text-slate-600",
								)}
							>
								{tab === "usage"
									? language === "fr"
										? "Conseils d'utilisation"
										: "How to use"
									: tab === "ingredients"
										? language === "fr"
											? "Ingrédients"
											: "Ingredients"
										: language === "fr"
											? "Preuve Scientifique"
											: "Evidence"}
							</button>
						))}
					</div>

					<div className="py-5 font-sans">
						{activeTab === "usage" && (
							<div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
								{/* <p>{product.usage}</p> */}
								<p>Usage</p>
								<p>
									{language === "fr" ? (
										<>
											<strong>Note:</strong> Nous vous recommandons de commencer
											par 1 dose par jour. Idéalement mélangé à un liquide
											froid, car les liquides chauds peuvent dégrader les
											cultures de probiotiques ou les vitamines actives.
										</>
									) : (
										<>
											<strong>Note:</strong> We recommend starting consistency
											with 1 dose daily. Best mixed with cold liquid, as hot
											liquids can degrade active probiotic cultures or vitamins.
										</>
									)}
								</p>
							</div>
						)}

						{activeTab === "ingredients" && (
							<div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
								<p className="font-bold mb-3 text-slate-900">
									{language === "fr"
										? "Ingrédients actifs dans chaque dose :"
										: "Active ingredients in each dose:"}
								</p>
								<p className="mt-4 text-[11px] text-slate-400 leading-snug">
									{language === "fr"
										? "Toutes les formulations de compléments Zamazor sont sans stéarate de magnésium, sans gluten, sans OGM, sans soja ni produits laitiers. Les fiches de lots transparentes sont accessibles via le code QR imprimé au fond du flacon."
										: "All Zamazor supplement formulations are free from magnesium stearate, gluten, GMOs, soy, and dairy. Full transparent batch sheets are accessible via the QR code printed on the bottom canister."}
								</p>
							</div>
						)}

						{activeTab === "science" && (
							<div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
								<p>
									{language === "fr"
										? "Chaque composant actif de ce produit est inclus dans des dosages cliniques et scientifiquement prouvés plutôt que dans des micro-doses génériques. Nos formulations sont validées par des scientifiques du sport et des chimistes certifiés."
										: "Every active component in this product is included in clinical, science-backed dosages rather than generic micro-doses. Our formulations are validated by sports scientists and certified chemists."}
								</p>
								<div className="flex items-center gap-2 mt-4 text-emerald-800 font-semibold text-xs">
									<ShieldCheckIcon className="size-4" />
									<span>
										{language === "fr"
											? "Établissement certifié de qualité NSF et ISO-9001"
											: "Certified NSF & ISO-9001 quality facility"}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
