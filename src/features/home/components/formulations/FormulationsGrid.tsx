import cardNutrientImg from "@/assets/images/card_nutrient.png";
import cardImmuneImg from "@/assets/images/card_immune.png";
import cardMindImg from "@/assets/images/card_mind.png";
import heroProtein from "@/assets/images/hero_protein.png";
import heroGreens from "@/assets/images/hero_greens.png";
import heroRecovery from "@/assets/images/hero_recovery.png";
import { APP_ROUTES } from "@/app/routes/paths";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

interface FormulationCard {
	id: string;
	badge: string;
	title: string;
	bgImage: string;
	productImg: string;
	productAlt: string;
	delay: number;
}

const FORMULATIONS: FormulationCard[] = [
	{
		id: "nutrient",
		badge: "Nutrient Support",
		title: "Support metabolic balance",
		bgImage: cardNutrientImg,
		productImg: heroProtein,
		productAlt: "Protein canister",
		delay: 0,
	},
	{
		id: "immune",
		badge: "Immune Defense",
		title: "Strengthen natural immunity",
		bgImage: cardImmuneImg,
		productImg: heroGreens,
		productAlt: "Greens canister",
		delay: 0.08,
	},
	{
		id: "mind",
		badge: "Mind & Focus",
		title: "Promote cognitive health",
		bgImage: cardMindImg,
		productImg: heroRecovery,
		productAlt: "Hydra canister",
		delay: 0.16,
	},
];

export const FormulationsGrid = () => {
	const navigate = useNavigate();

	return (
		<section
			id="formulations"
			className="bg-surface-3 py-20 border-b border-brand-900/10"
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<p className="text-xs font-black uppercase tracking-widest text-brand-700">
						Formulations
					</p>
					<h2 className="mt-2 text-3xl font-playfair font-normal leading-tight text-ink sm:text-5xl">
						Science-backed formulations
					</h2>
					<p className="mt-4 mx-auto max-w-2xl text-base leading-relaxed text-ink-soft">
						Our targeted blends combine research-backed ingredients with
						thoughtful formulation to support lasting vitality and everyday
						balance.
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					{FORMULATIONS.map((card) => (
						<motion.div
							key={card.id}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.35, delay: card.delay }}
							onClick={() => navigate(APP_ROUTES.SHOP)}
							className="relative overflow-hidden rounded-3xl aspect-4/5 p-6 sm:p-8 flex flex-col justify-between shadow-lg border border-brand-900/10 group cursor-pointer hover:-translate-y-1 transition-all duration-300"
						>
							{/* Background Image & Overlay */}
							<div
								className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
								style={{ backgroundImage: `url(${card.bgImage})` }}
							/>
							<div className="absolute inset-0 bg-linear-to-t from-brand-950/85 via-brand-950/30 to-black/30 group-hover:from-brand-950/90 group-hover:via-brand-950/40 transition-colors duration-300" />

							{/* Top Content */}
							<div className="relative z-10">
								<span className="inline-block bg-white/15 backdrop-blur-md text-white border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
									{card.badge}
								</span>
								<h3 className="mt-5 text-2xl sm:text-3xl font-playfair font-normal leading-tight text-white max-w-xs">
									{card.title}
								</h3>
							</div>

							{/* Bottom Action */}
							<div className="relative z-10 flex items-end justify-between mt-auto">
								<button className="bg-accent text-brand-950 hover:bg-accent/90 font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all duration-200 transform active:scale-95 shadow-md shadow-lime-950/20">
									Shop Now
								</button>

								<div className="h-20 w-16 sm:h-24 sm:w-20 bg-white/95 backdrop-blur-xs rounded-2xl flex items-center justify-center shadow-xl overflow-hidden transition-transform duration-300 group-hover:scale-110">
									<img
										src={card.productImg}
										alt={card.productAlt}
										className="h-full w-full object-contain p-1"
									/>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};
