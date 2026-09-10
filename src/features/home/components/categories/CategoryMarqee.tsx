import { useNavigate } from "react-router";
import type { Category } from "../../../products/schemas/categorySchema";
import { APP_ROUTES } from "@/app/routes/paths";

interface CategoryMarqueeProps {
	categories: Category[] | undefined;
}

export const CategoryMarquee = ({ categories }: CategoryMarqueeProps) => {
	if (!categories || categories.length === 0) return null;

	return (
		<section
			className="bg-brand-200 py-4 border-y border-brand-900/15 overflow-hidden select-none relative"
			aria-label="Product Categories"
		>
			<div className="flex w-max animate-marquee hover:paused whitespace-nowrap items-center">
				{Array.from({ length: 5 }).map((_, listIndex) => (
					<div
						key={listIndex}
						className="flex items-center"
						aria-hidden={listIndex > 0 ? "true" : undefined}
					>
						{categories.map((category) => (
							<ShopCategoryButton
								key={`${listIndex}-${category.id}`}
								{...category}
							/>
						))}
					</div>
				))}
			</div>
		</section>
	);
};

const ShopCategoryButton = ({ id, label }: Category) => {
	const navigate = useNavigate();

	return (
		<button
			onClick={() => navigate(`${APP_ROUTES.SHOP}?category=${id}`)}
			className="flex items-center gap-3 mx-4 bg-card/60 hover:bg-card border border-brand-900/10 px-4 py-2 rounded-full hover:scale-105 transition-all duration-200 cursor-pointer shadow-xs"
		>
			<span className="font-sans font-semibold text-xs sm:text-sm text-brand-950">
				{label}
			</span>
		</button>
	);
};
