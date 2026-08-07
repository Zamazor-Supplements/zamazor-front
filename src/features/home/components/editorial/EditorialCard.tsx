import { cardLift } from "@/app/config/motion";
import { APP_ROUTES } from "@/app/routes/paths";
import type { Product } from "@/features/products/schemas/productSchema";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { formatCurrency } from "@/shared/utils/price";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";

interface RoutineHighlight {
	id: string;
	title: string;
	copy: string;
	product?: Product | undefined;
	image: string;
	tone: string;
}

export const EditorialCard = ({
	item,
	index,
}: {
	item: RoutineHighlight;
	index: number;
}) => {
	const productUrl = item.product
		? `/product/${item.product.id}`
		: APP_ROUTES.SHOP;

	return (
		<motion.article
			variants={cardLift}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.32 + index * 0.04, ease: "easeOut" }}
			className="group flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-emerald-900/10 bg-[#fbfdf9] shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10"
		>
			<div>
				{/* Image Header */}
				<div className="relative aspect-4/3 overflow-hidden bg-white">
					<img
						src={item.image}
						alt={item.product?.name || item.title}
						loading="lazy"
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-linear-to-t from-slate-950/20 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
					<span
						className={cn(
							"absolute left-3 top-3 rounded-full border border-white/40 bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em]",
							item.tone,
						)}
					>
						{item.product?.category.label || "Selection"}
					</span>
				</div>

				{/* Body Details */}
				<div className="space-y-3 p-4">
					<div>
						<h3 className="text-lg font-black leading-tight text-slate-950">
							{item.title}
						</h3>
						<p className="mt-2 text-sm leading-6 text-slate-500">{item.copy}</p>
					</div>

					<div className="flex items-center justify-between gap-3 pt-2">
						<div>
							<p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
								Featured product
							</p>
							<p className="mt-0.5 text-sm font-bold text-slate-900">
								{item.product?.name || "Discover now"}
							</p>
						</div>
						{item.product && (
							<p className="text-sm font-black text-emerald-900 shrink-0">
								{formatCurrency(item.product.price)}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Card Actions Footer */}
			<div className="flex items-center gap-2 p-4 pt-0">
				<Button
					asChild
					variant="outline"
					className="h-10 flex-1 rounded-xl border-emerald-900/10 text-emerald-800 hover:bg-emerald-50"
				>
					<Link to={productUrl}>View product</Link>
				</Button>

				<Button
					asChild
					variant="default"
					size="icon"
					aria-label="Go to product details or shop"
					className="h-10 w-10 shrink-0 rounded-xl bg-emerald-900 text-white hover:bg-emerald-950 cursor-pointer"
				>
					<Link to={productUrl}>
						<ArrowRightIcon className="size-4" />
					</Link>
				</Button>
			</div>
		</motion.article>
	);
};
