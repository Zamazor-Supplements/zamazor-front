import { useNavigate } from "react-router";
import type { Category } from "../../../products/schemas/categorySchema";
import { APP_ROUTES } from "@/app/routes/paths";

interface CategoryMarqueeProps {
	categories: Category[] | undefined;
}

export const CategoryMarquee = ({ categories }: CategoryMarqueeProps) => {
	const navigate = useNavigate();

	if (!categories || categories.length === 0) return null;

	return (
		<section className="bg-[#b8cfc4] py-4 border-y border-emerald-900/15 overflow-hidden select-none">
			<div className="flex w-max animate-marquee whitespace-nowrap items-center">
				{Array.from({ length: 8 }).map((_, listIndex) => (
					<div key={listIndex} className="flex items-center">
						{categories.map(({ id, label }) => (
							<div
								key={`${listIndex}-${id}`}
								className="flex items-center mx-6 sm:mx-8"
							>
								<button
									onClick={() => navigate(APP_ROUTES.SHOP)}
									className="bg-white text-emerald-950 font-sans font-bold text-[11px] sm:text-xs px-5 py-2 rounded-full shadow-xs hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-800"
								>
									Shop
								</button>
								<span className="font-playfair text-xl sm:text-2xl text-emerald-950 font-medium ml-4 sm:ml-5">
									{label}
								</span>
							</div>
						))}
					</div>
				))}
			</div>
		</section>
	);
};
