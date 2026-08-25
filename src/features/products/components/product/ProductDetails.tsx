import {
	BadgeCheckIcon,
	CompassIcon,
	LeafIcon,
	Loader2Icon,
	ShieldCheckIcon,
	ShoppingBagIcon,
	SparklesIcon,
} from "lucide-react";
import { useMemo, useState, type MouseEvent } from "react";
import { useLanguage } from "@/shared/hooks/use-language";
import { cn } from "@/lib/utils";
import { OriginButton } from "@/shared/components/ui/origin-button";
import { formatPrice } from "@/shared/utils/price";
import type { Product } from "../../schemas/productSchema";
import { useAddToCart } from "@/features/cart/services/mutations";
import { useIsWishlistItem } from "@/features/wishlists/services/queries";
import { useToggleWishlist } from "@/features/wishlists/services/mutations";
import { WishlistToggleButton } from "@/features/wishlists/components/WishlistToggleButton";
import { QuantitySelector } from "@/shared/components/ui/quantity-selector";
import { Image } from "@/shared/components/ui/image";
import { RatingStars } from "@/shared/components/ui/rating-stars";
import {
	getCuratedDosage,
	getCuratedIngredients,
	getCuratedRating,
	getCuratedReviews,
} from "../../config/curatedContent";

const HIGHLIGHT_FEATURES = [
	{
		icon: ShieldCheckIcon,
		title: "3rd Party Tested",
		subtitle: "Lab verified purity",
	},
	{
		icon: LeafIcon,
		title: "100% Clean",
		subtitle: "No artificial colors",
	},
	{
		icon: SparklesIcon,
		title: "Optimal Dose",
		subtitle: "High bioavailability",
	},
] as const;

type TabId = "dosage" | "ingredients" | "reviews" | "science";

function getCategoryAdvisory(categoryLabel: string) {
	if (categoryLabel.includes("Recovery")) {
		return "Consuming Night Repair 30-45 minutes before bedtime encourages deeper recovery and resets muscle tissue cell growth overnight.";
	}
	if (categoryLabel.includes("Protein")) {
		return "Take within 45 minutes of training to build muscle fibers, or use as a mid-day meal supplement to boost metabolic energy.";
	}
	if (categoryLabel.includes("Greens")) {
		return "Consume first thing in the morning on an empty stomach for peak absorption of micronutrients and sustained cellular energy.";
	}
	return "Consume daily at a consistent time to build a sustainable routine. Pair with your usual wellness habits for best results.";
}

interface ProductDetailsProps {
	product: Product;
}

interface ProductDetailsProps {
	product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
	const [prevProductId, setPrevProductId] = useState(product.id);
	const [activeTab, setActiveTab] = useState<TabId>("dosage");
	const [quantity, setQuantity] = useState(1);

	if (prevProductId !== product.id) {
		setPrevProductId(product.id);
		setQuantity(1);
		setActiveTab("dosage");
	}

	const { t } = useLanguage();
	const isFavorite = useIsWishlistItem(product.id);

	const toggleWishlistMutation = useToggleWishlist();
	const addToCartMutation = useAddToCart();

	const isAddingToCart = addToCartMutation.isPending;
	const isTogglingWishlist = toggleWishlistMutation.isPending;
	const categoryLabel = product.category?.label;

	const handleWishlistClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (isTogglingWishlist) return;
		toggleWishlistMutation.mutate(product);
	};

	const handleAddToCartClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (isAddingToCart) return;
		addToCartMutation.mutate({ product, quantity });
	};

	const wishlistLabel = isFavorite ? "Remove from wishlist" : "Add to wishlist";

	const advisoryText = useMemo(
		() => getCategoryAdvisory(categoryLabel ?? ""),
		[categoryLabel],
	);

	const ingredients = useMemo(
		() =>
			product.ingredients && product.ingredients.length > 0
				? product.ingredients
				: getCuratedIngredients(categoryLabel),
		[product.ingredients, categoryLabel],
	);
	const dosage = product.dosage || getCuratedDosage(categoryLabel);
	const reviews = useMemo(
		() =>
			product.reviews && product.reviews.length > 0
				? product.reviews
				: getCuratedReviews(),
		[product.reviews],
	);
	const rating = product.rating ?? getCuratedRating();

	const TABS: { id: TabId; label: string }[] = [
		{ id: "dosage", label: t("pdp.dosage") },
		{ id: "ingredients", label: t("pdp.ingredientsTitle") },
		{ id: "reviews", label: t("pdp.reviews") },
		{ id: "science", label: t("pdp.evidence") },
	];

	return (
		<div className="grid gap-8 lg:gap-12 lg:grid-cols-2 lg:items-start">
			{/* Left Column: Media & Feature Badges */}
			<div className="space-y-6 lg:sticky lg:top-24">
				<div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl border border-brand-950/10 bg-card p-6 sm:p-10 shadow-lg shadow-brand-950/5">
					{categoryLabel && (
						<span className="absolute left-4 top-4 sm:left-6 sm:top-6 z-10 rounded-full border border-brand-900/10 bg-brand-50 px-3.5 py-1 text-xs font-bold text-brand-900 shadow-xs">
							{categoryLabel}
						</span>
					)}

					<WishlistToggleButton
						label={wishlistLabel}
						isFavorite={isFavorite}
						isPending={isTogglingWishlist}
						onClick={handleWishlistClick}
						className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20 size-10 rounded-full border border-brand-950/10 bg-card shadow-xs hover:scale-105 hover:text-rose-500"
					/>

					<Image
						src={product.imageUrl}
						alt={product.name}
						objectFit="contain"
						className="h-4/5 w-4/5 transition-transform duration-300 group-hover:scale-105"
					/>
				</div>

				{/* Feature Highlights Grid */}
				<div className="grid grid-cols-3 gap-3">
					{HIGHLIGHT_FEATURES.map(({ icon: Icon, title, subtitle }) => (
						<div
							key={title}
							className="rounded-2xl border border-brand-900/10 bg-card p-3 sm:p-4 text-center shadow-xs"
						>
							<Icon className="mx-auto size-5 text-brand-700" />
							<p className="mt-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wide text-slate-900">
								{title}
							</p>
							<p className="mt-0.5 text-[9px] sm:text-[10px] text-slate-500">
								{subtitle}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* Right Column: Information & Actions */}
			<div className="flex flex-col justify-between">
				<div>
					{categoryLabel && (
						<p className="text-xs font-black uppercase tracking-widest text-brand-700">
							{categoryLabel}
						</p>
					)}

					<h1 className="mt-2 font-playfair text-3xl font-normal leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
						{product.name}
					</h1>

					{/* Ratings */}
					<div className="mt-4">
						<RatingStars
							rating={rating}
							count={reviews.length}
							showValue
							size={18}
						/>
					</div>

					{/* Pricing */}
					<div className="mt-6 flex flex-wrap items-baseline gap-3 sm:gap-4">
						<span className="text-3xl font-black text-slate-950">
							{formatPrice(product.price)}
						</span>
						<span className="text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
							Free shipping included
						</span>
					</div>

					<p className="mt-6 font-sans text-sm leading-relaxed text-slate-600 sm:text-base">
						{product.description}
					</p>

					{/* Context Advisory Box */}
					{advisoryText && (
						<div className="mt-6 sm:mt-8 flex items-start gap-4 rounded-2xl border border-brand-900/10 bg-brand-50/40 p-4 sm:p-5">
							<CompassIcon className="mt-0.5 size-6 shrink-0 text-brand-800" />
							<div>
								<h3 className="font-sans text-sm font-bold text-slate-900">
									{t("pdp.optimalWindow")}
								</h3>
								<p className="mt-1 font-sans text-xs leading-relaxed text-slate-600">
									{advisoryText}
								</p>
							</div>
						</div>
					)}

					{/* Actions Bar */}
					<div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 border-t border-brand-900/10 pt-6 sm:pt-8">
						<div className="flex justify-center sm:justify-start">
							<QuantitySelector
								value={quantity}
								onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
								onIncrease={() => setQuantity((q) => q + 1)}
							/>
						</div>

						<div className="flex flex-1 gap-3">
							<OriginButton
								onClick={handleAddToCartClick}
								disabled={isAddingToCart}
								aria-label={`Add ${product.name} to cart`}
								className={cn(
									"flex-1 h-12 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all",
									isAddingToCart && "opacity-75 cursor-not-allowed",
								)}
							>
								{isAddingToCart ? (
									<>
										<Loader2Icon className="size-4 animate-spin" />
										{t("common.adding")}
									</>
								) : (
									<>
										<ShoppingBagIcon className="size-4" />
										<span>{t("common.addToCart")}</span>
										<span className="opacity-40">•</span>
										<span>{formatPrice(product.price * quantity)}</span>
									</>
								)}
							</OriginButton>

							<WishlistToggleButton
								label={wishlistLabel}
								isFavorite={isFavorite}
								isPending={isTogglingWishlist}
								onClick={handleWishlistClick}
								isAnimated={false}
								className="size-12 shrink-0 rounded-xl border border-brand-900/10 text-slate-600 shadow-xs hover:border-rose-100 hover:bg-rose-50/50 hover:text-rose-600"
							/>
						</div>
					</div>
				</div>

				{/* Tabbed Supplementary Content */}
				<div className="mt-10 border-t border-brand-900/10 pt-8">
					<div className="flex gap-4 sm:gap-6 overflow-x-auto border-b border-brand-900/15 scrollbar-none">
						{TABS.map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className={cn(
									"-mb-px whitespace-nowrap border-b-2 pb-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer",
									activeTab === tab.id
										? "border-brand-800 text-brand-900"
										: "border-transparent text-slate-400 hover:text-slate-600",
								)}
							>
								{tab.label}
							</button>
						))}
					</div>

					<div className="py-6 font-sans">
						{activeTab === "dosage" && (
							<div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-600">
								<p>{dosage}</p>
							</div>
						)}

						{activeTab === "ingredients" && (
							<div className="text-xs sm:text-sm leading-relaxed text-slate-600">
								<p className="mb-3 font-bold text-slate-900">
									{t("pdp.ingredientsTitle")}
								</p>
								<ul className="mb-3 list-inside list-disc space-y-1.5">
									{ingredients.map((ing, i) => (
										<li key={i}>{ing}</li>
									))}
								</ul>
								<p className="mt-4 text-[11px] leading-snug text-slate-400">
									{t("pdp.cleanNote")}
								</p>
							</div>
						)}

						{activeTab === "reviews" && (
							<div className="space-y-4">
								{reviews.map((review, i) => (
									<article
										key={i}
										className="rounded-2xl border border-brand-900/10 bg-card p-4 shadow-xs"
									>
										<div className="flex items-center justify-between gap-3">
											<div className="flex items-center gap-2.5">
												<div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-black text-brand-800">
													{review.author.charAt(0).toUpperCase()}
												</div>
												<div>
													<p className="text-sm font-bold text-slate-900">
														{review.author}
													</p>
													{review.verified && (
														<p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-600">
															<BadgeCheckIcon className="size-3" />
															{t("pdp.verifiedBadge")}
														</p>
													)}
												</div>
											</div>
											<RatingStars rating={review.rating} size={14} />
										</div>
										<p className="mt-3 text-sm leading-relaxed text-slate-600">
											{review.body}
										</p>
									</article>
								))}
								<p className="text-[11px] text-slate-400">
									{t("pdp.reviewsNote")}
								</p>
							</div>
						)}

						{activeTab === "science" && (
							<div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-600">
								<p>
									Every active component in this product is included in
									clinical, science-backed dosages rather than generic
									micro-doses. Our formulations are validated by sports
									scientists and certified chemists.
								</p>
								<div className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-800">
									<ShieldCheckIcon className="size-4 shrink-0" />
									<span>Certified NSF & ISO-9001 quality facility</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
