import {
	CompassIcon,
	LeafIcon,
	Loader2Icon,
	MinusIcon,
	PlusIcon,
	ShieldCheckIcon,
	ShoppingBagIcon,
	SparklesIcon,
	StarIcon,
} from "lucide-react";
import { useMemo, useState, type MouseEvent } from "react";
import { useLanguage } from "@/shared/hooks/use-language";
import { cn } from "@/lib/utils";
import { OriginButton } from "@/shared/components/ui/origin-button";
import { formatCurrency } from "@/shared/utils/price";
import type { Product } from "../../schemas/productSchema";
import { useAddToCart } from "@/features/cart/services/mutations";
import { useIsWishlistItem } from "@/features/wishlists/services/queries";
import { useToggleWishlist } from "@/features/wishlists/services/mutations";
import { WishlistToggleButton } from "@/features/wishlists/components/WishlistToggleButton";

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

const TABS = [
	// { id: "usage", label: "How to use" },
	// { id: "ingredients", label: "Ingredients" },
	{ id: "science", label: "Evidence" },
] as const;
type TabType = (typeof TABS)[number]["id"];

function getCategoryAdvisory(categoryLabel: string) {
	if (categoryLabel.includes("Recovery")) {
		return "Consuming Night Repair 30-45 minutes before bedtime encourages deeper recovery and resets muscle tissue cell growth overnight.";
	}
	if (categoryLabel.includes("Protein")) {
		return "Take within 45 minutes of training to build muscle fibers, or use as a mid-day meal supplement to boost metabolic energy.";
	}
	if (categoryLabel.includes("Greens")) {
		return "Consume first thing in the morning on an empty stomach to enhance gut biome health and natural digestive enzyme pathways.";
	}
	return "Sip throughout workout cycles or focus windows to maintain hydration, blood flow, and sustained mineral levels.";
}

interface QuantitySelectorProps {
	quantity: number;
	onChange: (fn: (prev: number) => number) => void;
}
const QuantitySelector = ({ quantity, onChange }: QuantitySelectorProps) => (
	<div className="flex items-center self-start rounded-xl border border-emerald-900/15 bg-white p-1 sm:self-auto">
		<button
			type="button"
			onClick={() => onChange((prev) => Math.max(1, prev - 1))}
			aria-label="Decrease quantity"
			className="flex size-9 items-center justify-center rounded-lg font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
		>
			<MinusIcon className="size-3" />
		</button>
		<span className="w-12 text-center text-sm font-bold text-slate-900 select-none">
			{quantity}
		</span>
		<button
			type="button"
			onClick={() => onChange((prev) => prev + 1)}
			aria-label="Increase quantity"
			className="flex size-9 items-center justify-center rounded-lg font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
		>
			<PlusIcon className="size-3" />
		</button>
	</div>
);

interface ProductDetailsProps {
	product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
	const [activeTab, setActiveTab] = useState<TabType>("science");
	const [quantity, setQuantity] = useState(1);

	const { t } = useLanguage();
	const isFavorite = useIsWishlistItem(product.id);

	const toggleWishlistMutation = useToggleWishlist();
	const addToCartMutation = useAddToCart();

	const isAddingToCart = addToCartMutation.isPending;
	const isTogglingWishlist = toggleWishlistMutation.isPending;

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
		() => getCategoryAdvisory(product.category?.label),
		[product.category?.label],
	);

	return (
		<div className="grid gap-12 lg:grid-cols-2 lg:items-start">
			{/* Left Column: Media & Feature Badges */}
			<div className="space-y-6">
				<div className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] border border-emerald-950/5 bg-white p-8 shadow-lg shadow-emerald-950/5">
					{product.category?.label && (
						<span className="absolute left-6 top-6 z-10 rounded-full border border-emerald-900/10 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-900 shadow-xs">
							{product.category.label}
						</span>
					)}

					<WishlistToggleButton
						label={wishlistLabel}
						isFavorite={isFavorite}
						isPending={isTogglingWishlist}
						onClick={handleWishlistClick}
						className="absolute right-6 top-6 z-20 size-10 rounded-full border border-emerald-950/5 bg-white shadow-xs hover:scale-105 hover:text-rose-500"
					/>

					<img
						src={product.imageUrl}
						alt={product.name}
						className="h-4/5 w-4/5 object-contain transition-transform duration-300 group-hover:scale-105"
					/>
				</div>

				{/* Feature Highlights Grid */}
				<div className="grid grid-cols-3 gap-3">
					{HIGHLIGHT_FEATURES.map(({ icon: Icon, title, subtitle }) => (
						<div
							key={title}
							className="rounded-2xl border border-emerald-900/5 bg-white p-4 text-center shadow-xs"
						>
							<Icon className="mx-auto size-5 text-emerald-700" />
							<p className="mt-2 text-xs font-extrabold uppercase tracking-wide text-slate-900">
								{title}
							</p>
							<p className="mt-0.5 text-[10px] text-slate-500">{subtitle}</p>
						</div>
					))}
				</div>
			</div>

			{/* Right Column: Information & Actions */}
			<div className="flex flex-col justify-between">
				<div>
					{product.category?.label && (
						<p className="text-xs font-black uppercase tracking-widest text-emerald-700">
							{product.category.label}
						</p>
					)}

					<h1 className="mt-2 font-playfair text-4xl font-normal leading-none text-slate-950 sm:text-5xl">
						{product.name}
					</h1>

					{/* Ratings */}
					<div className="mt-4 flex items-center gap-2">
						<div className="flex text-amber-400" aria-label="5 out of 5 stars">
							{Array.from({ length: 5 }).map((_, i) => (
								<StarIcon key={i} className="size-4 fill-current" />
							))}
						</div>
						<span className="text-xs font-bold text-slate-500">
							4.9 (184 reviews)
						</span>
					</div>

					{/* Pricing */}
					<div className="mt-6 flex items-baseline gap-4">
						<span className="text-3xl font-black text-slate-950">
							{formatCurrency(product.price)}
						</span>
						<span className="text-sm font-semibold text-slate-500">
							Free shipping included
						</span>
					</div>
					<p className="mt-6 font-sans text-sm text-slate-600 leading-relaxed sm:text-base">
						{product.description}
					</p>

					{/* Context Advisory Box */}
					{advisoryText && (
						<div className="mt-8 flex items-start gap-4 rounded-2xl border border-emerald-900/10 bg-[#f0f7ec] p-5">
							<CompassIcon className="mt-0.5 size-6 shrink-0 text-emerald-800" />
							<div>
								<h3 className="font-sans text-sm font-bold text-emerald-950">
									Optimal Daily Window
								</h3>
								<p className="mt-1 font-sans text-xs text-slate-600 leading-relaxed">
									{advisoryText}
								</p>
							</div>
						</div>
					)}

					{/* Actions Bar */}
					<div className="mt-8 flex flex-col gap-4 border-t border-emerald-900/5 pt-8 sm:flex-row sm:items-center">
						<QuantitySelector quantity={quantity} onChange={setQuantity} />

						<div className="flex flex-1 gap-3">
							<OriginButton
								variant="emerald"
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
										{t("common.addToCart")} &bull;{" "}
										{formatCurrency(product.price * quantity)}
									</>
								)}
							</OriginButton>

							<WishlistToggleButton
								label={wishlistLabel}
								isFavorite={isFavorite}
								isPending={isTogglingWishlist}
								onClick={handleWishlistClick}
								isAnimated={false}
								className="size-12 rounded-xl border border-emerald-900/10 text-slate-700 shadow-sm hover:border-rose-100 hover:bg-rose-50/50 hover:text-rose-600"
							/>
						</div>
					</div>
				</div>

				{/* Tabbed Supplementary Content */}
				<div className="mt-10 border-t border-emerald-900/5 pt-8">
					<div className="flex gap-6 border-b border-emerald-900/10">
						{TABS.map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className={cn(
									"-mb-0.5 border-b-2 pb-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer",
									activeTab === tab.id
										? "border-emerald-800 text-emerald-900"
										: "border-transparent text-slate-400 hover:text-slate-600",
								)}
							>
								{tab.label}
							</button>
						))}
					</div>

					<div className="py-5 font-sans">
						{/* // Todo: Add Product Usage
						{activeTab === "usage" && (
							<div className="space-y-3 text-xs text-slate-600 leading-relaxed sm:text-sm">
								<p>{product.usage || "Standard daily consumption routine."}</p>
								<p>
									<strong>Note:</strong> We recommend starting consistency with
									1 dose daily. Best mixed with cold liquid, as hot liquids can
									degrade active probiotic cultures or vitamins.
								</p>
							</div>
						)} */}

						{/* // Todo: Add Product Ingredients
						{activeTab === "ingredients" && (
							<div className="text-xs text-slate-600 leading-relaxed sm:text-sm">
								<p className="mb-3 font-bold text-slate-900">
									Active ingredients in each dose:
								</p>
								{product.ingredients?.length ? (
									<ul className="mb-3 list-disc list-inside space-y-1">
										{product.ingredients.map((ing, i) => (
											<li key={i}>{ing}</li>
										))}
									</ul>
								) : null}
								<p className="mt-4 text-[11px] text-slate-400 leading-snug">
									All Zamazor supplement formulations are free from magnesium
									stearate, gluten, GMOs, soy, and dairy. Full transparent batch
									sheets are accessible via the QR code printed on the bottom
									canister.
								</p>
							</div>
						)} */}

						{activeTab === "science" && (
							<div className="space-y-2 text-xs text-slate-600 leading-relaxed sm:text-sm">
								<p>
									Every active component in this product is included in
									clinical, science-backed dosages rather than generic
									micro-doses. Our formulations are validated by sports
									scientists and certified chemists.
								</p>
								<div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-800">
									<ShieldCheckIcon className="size-4" />
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
