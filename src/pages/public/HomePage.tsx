import CONFIG from "@/core/config/constants";
import { APP_ROUTES } from "@/core/routes/paths";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { FAQSection } from "@/shared/components/ui/faqsection";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import { AnimatePresence, motion } from "framer-motion";
import {
	Check,
	X,
	ArrowRightIcon,
	BadgeCheckIcon,
	BatteryChargingIcon,
	BrainIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	DumbbellIcon,
	HeartPulseIcon,
	LeafIcon,
	MoonIcon,
	PackageCheckIcon,
	StarIcon,
	TruckIcon,
	ZapIcon,
	ShoppingBagIcon,
	Heart as HeartIcon,
	type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import type { Product } from "@/features/products/types";

import { OriginButton } from "@/shared/components/ui/origin-button";
import heroProtein from "@/assets/images/hero_protein.png";
import heroGreens from "@/assets/images/hero_greens.png";
import heroRecovery from "@/assets/images/hero_recovery.png";
import {
	productService,
	type BackendCategory,
} from "@/features/products/services/productService";
import { useBookmarkStore } from "@/features/products/stores/bookmarkStore";
import { useCartStore } from "@/shared/hooks/use-cart-store";
import { toast } from "sonner";
import { useLanguage } from "@/shared/context/LanguageContext";
import {
	buildQuizChoices,
	getQuizChoiceCopy,
	getRecommendedQuizProduct,
	type QuizTarget,
} from "@/shared/utils/product-quiz";


const getHeroSlides = (language: string) => [
	{
		image: heroProtein,
		kicker: language === "fr" ? "Performance végétale" : "Plant-powered performance",
		title: language === "fr" ? "Des compléments propres pour l'énergie, la force et la récupération." : "Clean supplements for energy, strength, and recovery.",
		copy: language === "fr" ? "Créez votre stack quotidien avec des formules transparentes, un excellent goût et des ingrédients choisis pour de vraies routines." : "Build your daily stack with transparent formulas, great taste, and ingredients chosen for real routines.",
		cta: language === "fr" ? "Acheter les meilleures ventes" : "Shop best sellers",
		accent: "bg-emerald-500",
		product: "GreenFuel Protein",
		type: language === "fr" ? "Lactosérum + légumes" : "Whey + greens",
		price: "390 MAD",
		theme: "emerald",
	},
	{
		image: heroGreens,
		kicker: language === "fr" ? "Clarté matinale" : "Morning clarity",
		title: language === "fr" ? "Commencez concentré sans coup de barre dû au sucre." : "Start focused without the sugar crash.",
		copy: language === "fr" ? "Hydratation, électrolytes, adaptogènes et superaliments conçus pour alléger vos journées bien remplies." : "Hydration, electrolytes, adaptogens, and greens designed to help busy days feel lighter.",
		cta: language === "fr" ? "Créer mon stack" : "Build my stack",
		accent: "bg-lime-500",
		product: "Daily Greens",
		type: language === "fr" ? "Mélange de superaliments" : "Superfood blend",
		price: "320 MAD",
		theme: "lime",
	},
	{
		image: heroRecovery,
		kicker: language === "fr" ? "Une récupération qui suit le rythme" : "Recovery that keeps up",
		title: language === "fr" ? "Dormez plus profondément, récupérez plus vite, revenez plus fort." : "Sleep deeper, recover faster, come back stronger.",
		copy: language === "fr" ? "Favorisez le repos, la réparation musculaire et la régularité avec des essentiels propres pour l'entraînement et le bien-être quotidien." : "Support rest, muscle repair, and consistency with clean essentials for training and everyday wellness.",
		cta: language === "fr" ? "Explorer la récupération" : "Explore recovery",
		accent: "bg-teal-500",
		product: "Night Repair",
		type: language === "fr" ? "Complexe de magnésium" : "Magnesium complex",
		price: "280 MAD",
		theme: "teal",
	},
];

const getDetailedStackSteps = (language: string) => [
	{
		time: "08:00 AM",
		moment: language === "fr" ? "DÉBUT DE MATINÉE" : "MORNING START",
		title: language === "fr" ? "Réveil propre" : "Wake up clean",
		copy: language === "fr" ? "Daily Greens et Hydra Charge aident votre matinée à démarrer avec des minéraux actifs, des enzymes digestives et une concentration stable." : "Daily Greens and Hydra Charge help your morning start with active minerals, digestive enzymes, and steady focus.",
		products: ["Daily Greens", "Hydra Charge"],
		icon: BatteryChargingIcon,
		color: "bg-emerald-500 text-white shadow-emerald-500/20"
	},
	{
		time: "02:00 PM",
		moment: language === "fr" ? "ENTRAÎNEMENT & CONCENTRATION" : "TRAINING & FOCUS",
		title: language === "fr" ? "S'entraîner avec intention" : "Train with intent",
		copy: language === "fr" ? "Les mélanges de protéines et les BCAAs de performance favorisent la synthèse musculaire, l'endurance et la récupération les jours d'entraînement." : "Protein blends and performance BCAAs support muscle synthesis, stamina, and recovery on training days.",
		products: ["GreenFuel Protein", "Pre-Workout Spark"],
		icon: DumbbellIcon,
		color: "bg-amber-500 text-white shadow-amber-500/20"
	},
	{
		time: "09:30 PM",
		moment: language === "fr" ? "REPOS & RÉPARATION" : "REST & REPAIR",
		title: language === "fr" ? "Reconstruire la nuit" : "Rebuild at night",
		copy: language === "fr" ? "Les formules de récupération à libération progressive et les minéraux apaisants favorisent des cycles de sommeil plus profonds et la réparation cellulaire naturelle." : "Slow-release recovery formulas and soothing minerals support deeper sleep cycles and natural cellular repair.",
	products: ["Night Repair", "Muscle Restore BCAAs"],
		icon: MoonIcon,
		color: "bg-indigo-600 text-white shadow-indigo-600/20"
	}
];

const getReviews = (language: string) => [
	{
		quote: language === "fr"
			? "Les superaliments ont un goût frais, pas herbacé. C'est la première habitude de complément que j'ai réellement gardée."
			: "The greens taste fresh, not grassy. It is the first supplement habit I have actually kept.",
		name: "Maya R.",
		meta: language === "fr" ? "Abonné Daily Greens" : "Daily Greens subscriber",
	},
	{
		quote: language === "fr"
			? "La protéine se mélange facilement et ne pèse pas sur l'estomac. Parfait après l'entraînement du matin."
			: "Protein mixes smooth and does not feel heavy. Perfect after morning training.",
		name: "Adam K.",
		meta: "GreenFuel Protein",
	},
	{
		quote: language === "fr"
			? "Le stack de récupération a rendu mes soirées plus régulières. Simple, propre et facile à faire confiance."
			: "The recovery stack made my evenings more consistent. Simple, clean, and easy to trust.",
		name: "Nadia S.",
		meta: language === "fr" ? "Pack Récupération" : "Recovery bundle",
	},
];

const getTrustItems = (language: string) => [
	{ label: language === "fr" ? "Lots testés en laboratoire" : "Lab-tested batches", icon: BadgeCheckIcon },
	{ label: language === "fr" ? "Sans colorants artificiels" : "No artificial colors", icon: LeafIcon },
	{ label: language === "fr" ? "Livraison rapide" : "Fast delivery", icon: TruckIcon },
	{ label: language === "fr" ? "Abonnements faciles" : "Easy subscriptions", icon: PackageCheckIcon },
];

const getMarqueeItems = (language: string) => [
	{ name: language === "fr" ? "Frais & Léger" : "Fresh & Light", targetId: APP_ROUTES.SHOP },
	{ name: language === "fr" ? "Vitamines & Minéraux" : "Vitamins & Minerals", targetId: APP_ROUTES.SHOP },
	{ name: language === "fr" ? "Prébiotiques" : "Prebiotics", targetId: APP_ROUTES.SHOP },
	{ name: language === "fr" ? "Antioxydants" : "Antioxidants", targetId: APP_ROUTES.SHOP },
];



const getProofStats = (language: string) => [
	{ value: "92%", label: language === "fr" ? "des clients se sont sentis plus réguliers après 30 jours" : "customers felt more consistent after 30 days" },
	{ value: "18g", label: language === "fr" ? "de protéines par portion dans notre mélange quotidien" : "protein per serving in our daily blend" },
	{ value: "0g", label: language === "fr" ? "de sucre ajouté dans l'hydratation et les superaliments" : "added sugar in hydration and greens" },
	{ value: "3rd", label: language === "fr" ? "testé par un laboratoire tiers pour la qualité et la pureté" : "party tested for quality and purity" },
];

const getComparisonData = (language: string) => [
	{
		feature: language === "fr" ? "Liste d'ingrédients transparente" : "Transparent ingredient list",
		zamazor: { text: language === "fr" ? "Divulgation complète à 100%" : "100% full disclosure", type: "success" },
		typical: { text: language === "fr" ? "Souvent caché dans des mélanges brevetés" : "Often hidden in proprietary blends", type: "fail" }
	},
	{
		feature: language === "fr" ? "Accompagnement de routine" : "Routine guidance",
		zamazor: { text: language === "fr" ? "Stacks personnalisés par objectif" : "Personalized stacks by goal", type: "success" },
		typical: { text: language === "fr" ? "Achat de produits uniquement" : "Product-only shopping", type: "fail" }
	},
	{
		feature: language === "fr" ? "Flexibilité d'abonnement" : "Subscription flexibility",
		zamazor: { text: language === "fr" ? "Sauter, suspendre ou modifier en 30s" : "Skip, pause, or edit in 30 seconds", type: "success" },
		typical: { text: language === "fr" ? "Cycles rigides et difficiles à annuler" : "Rigid, hard-to-cancel cycles", type: "fail" }
	},
	{
		feature: language === "fr" ? "Colorants & édulcorants artificiels" : "Artificial colors & sweeteners",
		zamazor: { text: language === "fr" ? "Jamais utilisé (zéro artificiel)" : "Never used (zero artificials)", type: "success" },
		typical: { text: language === "fr" ? "Couramment ajoutés pour le goût/la couleur" : "Commonly added for flavor/color", type: "fail" }
	},
	{
		feature: language === "fr" ? "Contrôles labo tiers" : "Third-party lab checks",
		zamazor: { text: language === "fr" ? "Chaque lot testé + rapports publics" : "Every batch tested + public reports", type: "success" },
		typical: { text: language === "fr" ? "Rarement fait ou gardé privé" : "Rarely done or private", type: "fail" }
	}
];

const fadeUp = {
	hidden: { opacity: 0, y: 24 },
	visible: { opacity: 1, y: 0 },
};

const sectionLift = {
	hidden: { opacity: 0, y: 28 },
	visible: { opacity: 1, y: 0 },
};

const cardLift = {
	hidden: { opacity: 0, y: 20, scale: 0.985 },
	visible: { opacity: 1, y: 0, scale: 1 },
};



function SectionHeading({
	kicker,
	title,
	copy,
}: {
	kicker: string;
	title: string;
	copy?: string;
}) {
	return (
		<motion.div
			variants={fadeUp}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.4 }}
			transition={{ duration: 0.32, ease: "easeOut" }}
			className="max-w-3xl"
		>
			<p className="text-sm font-bold uppercase text-emerald-700">{kicker}</p>
			<h2 className="mt-2 text-3xl font-playfair font-normal leading-tight tracking-normal text-slate-950 sm:text-4xl">
				{title}
			</h2>
			{copy ? <p className="mt-4 text-base leading-7 text-slate-600">{copy}</p> : null}
		</motion.div>
	);
}

function IconLabel({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
	return (
		<div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
			<span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
				<Icon className="size-4" aria-hidden="true" />
			</span>
			{label}
		</div>
	);
}

export const HomePage = () => {
	const navigate = useNavigate();
	const { language, t } = useLanguage();
	const addItem = useCartStore((state) => state.addItem);
	const addBookmark = useBookmarkStore((state) => state.addBookmark);
	const removeBookmark = useBookmarkStore((state) => state.removeBookmark);
	const isBookmarked = useBookmarkStore((state) => state.isBookmarked);

	const heroSlides = useMemo(() => getHeroSlides(language), [language]);
	const detailedStackSteps = getDetailedStackSteps(language);
	const reviews = getReviews(language);
	const trustItems = getTrustItems(language);
	const marqueeItems = getMarqueeItems(language);
	const proofStats = getProofStats(language);
	const comparisonData = getComparisonData(language);

	const [products, setProducts] = useState<Product[]>([]);
	const [loadingProducts, setLoadingProducts] = useState(true);
	const [categories, setCategories] = useState<BackendCategory[]>([]);
	const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
	const [activeCategoryId, setActiveCategoryId] = useState("all");
	const [loadingCategoryProducts, setLoadingCategoryProducts] = useState(false);

	const routineHighlights = useMemo(() => {
		const pick = (category: string) => products.find((product) => product.category === category) || null;
		const resolveImage = (fallback: string, product: Product | null) => product?.image || fallback;

		return [
			{
				title: language === "fr" ? "Des matinées plus légères." : "Mornings that feel lighter.",
				copy: language === "fr" ? "Micronutriments, hydratation et une première heure plus nette." : "Micronutrients, hydration, and a cleaner first hour.",
				product: pick("Greens"),
				image: resolveImage(heroGreens, pick("Greens")),
				tone: "bg-lime-100 text-lime-800",
			},
			{
				title: language === "fr" ? "Une protéine douce jusqu'à la fin." : "Protein with a calm finish.",
				copy: language === "fr" ? "Une carte protéinée simple pour soutenir la force et la régularité." : "A simple daily protein card for strength and consistency.",
				product: pick("Protein"),
				image: resolveImage(heroProtein, pick("Protein")),
				tone: "bg-emerald-100 text-emerald-800",
			},
			{
				title: language === "fr" ? "Récupérer une fois l'effort terminé." : "Recovery after the work is done.",
				copy: language === "fr" ? "Un soutien du soir doux, ciblé et facile à répéter." : "Evening support that feels soft, focused, and easy to repeat.",
				product: pick("Recovery"),
				image: resolveImage(heroRecovery, pick("Recovery")),
				tone: "bg-teal-100 text-teal-800",
			},
			{
				title: language === "fr" ? "De l'énergie sans agitation." : "Energy without the noise.",
				copy: language === "fr" ? "Une façon plus propre de rester alerte pour la journée." : "A cleaner way to stay switched on for the day ahead.",
				product: pick("Energy"),
				image: resolveImage(heroGreens, pick("Energy")),
				tone: "bg-amber-100 text-amber-800",
			},
		];
	}, [language, products]);

	const formulationCards = useMemo(() => {
		const featuredCategories: QuizTarget[] = ["Protein", "Greens", "Energy"];

		return featuredCategories
			.map((category) => {
				const product = products.find((item) => item.category === category) || null;
				if (!product) return null;

				const labelMap: Record<QuizTarget, {
					badgeFr: string;
					badgeEn: string;
					titleFr: string;
					titleEn: string;
					copyFr: string;
					copyEn: string;
				}> = {
					Protein: {
						badgeFr: "Protéines",
						badgeEn: "Protein formula",
						titleFr: "Formule de force et récupération",
						titleEn: "Strength and recovery formula",
						copyFr: "Un produit réel du catalogue, sélectionné pour l'équilibre entre performance et récupération.",
						copyEn: "A real catalog product selected for the balance between performance and recovery.",
					},
					Greens: {
						badgeFr: "Vitamines et minéraux",
						badgeEn: "Micronutrient support",
						titleFr: "Soutien quotidien plus léger",
						titleEn: "Lighter daily support",
						copyFr: "Un produit du backend pensé pour les matinées plus stables et une meilleure routine.",
						copyEn: "A backend product built for steadier mornings and a cleaner daily routine.",
					},
					Energy: {
						badgeFr: "Pré-entraînement",
						badgeEn: "Training energy",
						titleFr: "Énergie propre et focus",
						titleEn: "Clean energy and focus",
						copyFr: "Une formule réelle du catalogue pour les séances où il faut rester alerte et régulier.",
						copyEn: "A real catalog formula for sessions where you need to stay alert and consistent.",
					},
					Recovery: {
						badgeFr: "Récupération",
						badgeEn: "Recovery support",
						titleFr: "Repos et réparation",
						titleEn: "Rest and repair",
						copyFr: "Un produit du catalogue pensé pour soutenir le repos et la récupération après l'effort.",
						copyEn: "A catalog product built to support rest and recovery after effort.",
					},
					Wellness: {
						badgeFr: "Bien-être",
						badgeEn: "Wellness support",
						titleFr: "Soutien quotidien",
						titleEn: "Daily wellness support",
						copyFr: "Une formule du catalogue pour garder une routine simple, propre et régulière.",
						copyEn: "A catalog formula for keeping your routine simple, clean, and consistent.",
					},
				};

				return {
					category,
					product,
					...labelMap[category],
				};
			})
			.filter((card): card is NonNullable<typeof card> => Boolean(card));
	}, [products]);

	useEffect(() => {
		let isMounted = true;

		const loadProducts = async () => {
			setLoadingProducts(true);
			try {
				const result = await productService.getProductsPage({ page: 1, size: 100 });
				if (isMounted) {
					setProducts(result.items);
				}
			} finally {
				if (isMounted) {
					setLoadingProducts(false);
				}
			}
		};

		void loadProducts();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		let isMounted = true;

		const loadCategories = async () => {
			const backendCategories = await productService.getCategories();
			if (isMounted) {
				setCategories(backendCategories);
			}
		};

		void loadCategories();

		return () => {
			isMounted = false;
		};
	}, []);

	const [activeSlide, setActiveSlide] = useState(0);
	const slide = heroSlides[activeSlide];

	const [quizStep, setQuizStep] = useState<"intro" | "category" | "result">("intro");
	const [quizTarget, setQuizTarget] = useState<QuizTarget | "">("");
	const quizChoices = useMemo(() => buildQuizChoices(products), [products]);
	const quizIcons: Record<QuizTarget, LucideIcon> = {
		Protein: DumbbellIcon,
		Greens: LeafIcon,
		Energy: ZapIcon,
		Recovery: MoonIcon,
		Wellness: HeartPulseIcon,
	};

	const recommendedProduct = useMemo(() => {
		return getRecommendedQuizProduct(products, quizTarget);
	}, [products, quizTarget]);
	const selectedQuizChoice = useMemo(
		() => quizChoices.find((choice) => choice.id === quizTarget) || null,
		[quizChoices, quizTarget],
	);

	const resetQuiz = () => {
		setQuizStep("intro");
		setQuizTarget("");
	};

	const productSliderRef = useRef<HTMLDivElement>(null);
	const categorySliderRef = useRef<HTMLDivElement>(null);

	const categoryTabs = useMemo(
		() => [
			{ id: "all", label: language === "fr" ? "Tous" : "All" },
			...categories.map((category) => ({
				id: category.id,
				label: category.label,
			})),
		],
		[categories, language],
	);
	const displayedCategoryProducts =
		activeCategoryId === "all" ? products : categoryProducts;

	useEffect(() => {
		if (activeCategoryId === "all") return;
		let isMounted = true;

		const loadCategoryProducts = async () => {
			setLoadingCategoryProducts(true);
			setCategoryProducts([]);
			try {
				const result = await productService.getProductsByCategoryPage(activeCategoryId, {
					page: 1,
					size: 12,
				});
				if (isMounted) {
					setCategoryProducts(result.items);
				}
			} finally {
				if (isMounted) {
					setLoadingCategoryProducts(false);
				}
			}
		};

		void loadCategoryProducts();

		return () => {
			isMounted = false;
		};
	}, [activeCategoryId]);

	const scrollProductSlider = (direction: "left" | "right") => {
		const container = productSliderRef.current;
		if (!container) return;
		const scrollAmount = container.clientWidth * 0.75;
		container.scrollBy({
			left: direction === "left" ? -scrollAmount : scrollAmount,
			behavior: "smooth",
		});
	};

	const scrollCategorySlider = (direction: "left" | "right") => {
		const container = categorySliderRef.current;
		if (!container) return;
		const scrollAmount = container.clientWidth * 0.75;
		container.scrollBy({
			left: direction === "left" ? -scrollAmount : scrollAmount,
			behavior: "smooth",
		});
	};

	useDocumentTitle(`${CONFIG.APP_NAME} | Clean Supplements`);



	useEffect(() => {
		const timer = window.setInterval(() => {
			setActiveSlide((current) => (current + 1) % heroSlides.length);
		}, 5500);

		return () => window.clearInterval(timer);
	}, [heroSlides.length]);

	const goToPreviousSlide = () => {
		setActiveSlide((current) =>
			current === 0 ? heroSlides.length - 1 : current - 1,
		);
	};

	const goToNextSlide = () => {
		setActiveSlide((current) => (current + 1) % heroSlides.length);
	};


	return (
		<>
			<section className="relative w-full h-screen min-h-[600px] overflow-hidden border-b border-emerald-900/10 bg-emerald-950" style={{ marginTop: `calc(-1 * var(--header-height, 80px))`, transform: "translateY(-2px)" }}>
				{/* Background Image Carousel with Fade Animation */}
				<AnimatePresence mode="wait">
					<motion.div
						key={activeSlide}
						initial={{ opacity: 0, scale: 1.05 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 1.05 }}
												transition={{ duration: 0.45, ease: "easeInOut" }}
						className="absolute inset-0 bg-cover bg-center"
						style={{ backgroundImage: `url(${slide.image})` }}
					>
						{/* Premium Dark Gradient Overlay for Maximum Text Contrast */}
						<div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/65 to-transparent max-md:bg-emerald-950/80" />
					</motion.div>
				</AnimatePresence>

				{/* Floating Content Layer */}
				<div className="absolute inset-0 flex items-center pt-12 sm:pt-16 lg:pt-20">
					<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="max-w-2xl relative z-10">
							<AnimatePresence mode="wait">
								<motion.div
									key={activeSlide}
									initial="hidden"
									animate="visible"
									exit="exit"
									variants={{
										hidden: { opacity: 0 },
										visible: {
											opacity: 1,
											transition: {
											staggerChildren: 0.06,
												delayChildren: 0.12,
											},
										},
										exit: {
											opacity: 0,
											transition: { duration: 0.12, ease: "easeOut" },
										},
									}}
								>
									{/* kicker */}
									<motion.div
										variants={{
											hidden: { opacity: 0, y: 15 },
											visible: { opacity: 1, y: 0, transition: { duration: 0.12, ease: "easeOut" } },
											exit: { opacity: 0, y: -10 }
										}}
										className="mb-5 inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-950/55 px-3.5 py-1.5 text-sm font-bold text-emerald-300 shadow-sm backdrop-blur-sm"
									>
										<span className={cn("size-2 rounded-full", slide.accent)} />
										{t(`homepage.hero.badge${activeSlide + 1}`)}
									</motion.div>

									{/* title */}
									<motion.h1
										variants={{
											hidden: { opacity: 0, y: 20 },
											visible: { opacity: 1, y: 0, transition: { duration: 0.12, ease: "easeOut" } },
											exit: { opacity: 0, y: -15 }
										}}
										className="text-4xl font-playfair font-normal leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
									>
										{t(`homepage.hero.title${activeSlide + 1}`)}
									</motion.h1>

									{/* copy */}
									<motion.p
										variants={{
											hidden: { opacity: 0, y: 20 },
											visible: { opacity: 1, y: 0 },
											exit: { opacity: 0, y: -15 }
										}}
										className="mt-6 text-base sm:text-lg leading-relaxed text-emerald-50/85"
									>
										{t(`homepage.hero.desc${activeSlide + 1}`)}
									</motion.p>

									{/* CTA Buttons */}
									<motion.div
										variants={{
											hidden: { opacity: 0, y: 20 },
											visible: { opacity: 1, y: 0 },
											exit: { opacity: 0, y: -15 }
										}}
										className="mt-8 flex flex-col gap-3.5 sm:flex-row"
									>
										<Button asChild size="lg" className="h-12 bg-emerald-500 text-emerald-950 font-extrabold px-6 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20">
											<Link to={APP_ROUTES.SHOP}>
												{t("homepage.hero.shopNow")}
												<ArrowRightIcon className="ml-2 size-4" />
											</Link>
										</Button>
										<Button asChild variant="outline" size="lg" className="h-12 border-white/20 bg-white/10 text-white font-extrabold px-6 hover:bg-white/20 hover:text-white backdrop-blur-sm">
											<a href="#stack">{t("homepage.hero.quiz")}</a>
										</Button>
									</motion.div>
								</motion.div>
							</AnimatePresence>
						</div>
					</div>
				</div>

				{/* Centered Prev/Next Navigation Controls & Dots indicator at the bottom */}
				<div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-25 flex items-center gap-4 rounded-full border border-white/10 bg-emerald-950/45 px-5 py-2.5 shadow-2xl backdrop-blur-md">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Previous slide"
						className="size-9 rounded-full text-white hover:bg-white/20 hover:text-white"
						onClick={goToPreviousSlide}
					>
						<ChevronLeftIcon className="size-5" />
					</Button>

					<div className="flex gap-2">
						{heroSlides.map((item, index) => (
							<button
								key={item.title}
								type="button"
								aria-label={`Show slide ${index + 1}`}
								onClick={() => setActiveSlide(index)}
								className={cn(
									"h-2.5 rounded-full transition-all duration-300",
									index === activeSlide
										? "w-8 bg-emerald-400"
										: "w-2.5 bg-white/40 hover:bg-white/70",
								)}
							/>
						))}
					</div>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Next slide"
						className="size-9 rounded-full text-white hover:bg-white/20 hover:text-white"
						onClick={goToNextSlide}
					>
						<ChevronRightIcon className="size-5" />
					</Button>
				</div>
			</section>

			{/* Category Marquee Loop Section */}
			<section className="bg-[#b8cfc4] py-4.5 border-y border-emerald-900/15 overflow-hidden select-none">
				<div className="flex w-max animate-marquee whitespace-nowrap items-center">
					{Array.from({ length: 8 }).map((_, listIndex) => (
						<div key={listIndex} className="flex items-center">
							{marqueeItems.map((item, itemIndex) => (
								<div key={itemIndex} className="flex items-center mx-6 sm:mx-8">
									<button
									onClick={() => navigate(item.targetId)}
										className="bg-white text-emerald-950 font-sans font-bold text-[11px] sm:text-xs px-5 py-2 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
									>
										{language === "fr" ? "Boutique" : "Shop"}
									</button>
									<span className="font-playfair text-xl sm:text-2xl text-emerald-950 font-medium ml-4 sm:ml-5">
										{item.name}
									</span>
								</div>
							))}
						</div>
					))}
				</div>
			</section>

			{/* Interactive Supplement Advisor Quiz Section */}
			<section className="bg-[#fcfdfa] py-20 border-b border-emerald-900/10">
				<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
					<span className="text-xs font-black uppercase tracking-widest text-emerald-800">
						{language === "fr" ? "Sélecteur de catégorie" : "Category finder"}
					</span>
					<h2 className="mt-3 text-3xl font-playfair font-normal leading-tight text-slate-950 sm:text-4xl">
						{language === "fr" ? "Trouvez rapidement la bonne catégorie." : "Find the right category quickly."}
					</h2>
					<p className="mt-3 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
						{language === "fr"
							? "Choisissez la catégorie qui vous intéresse, puis ouvrez un produit réel du catalogue."
							: "Choose the category you need, then open a real product from the catalog."}
					</p>

					{/* Quiz Box */}
					<div className="mt-12 bg-gradient-to-br from-emerald-50/50 to-lime-50/20 border border-emerald-900/10 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden text-left min-h-[420px] flex flex-col justify-between">
						
						{/* Step: INTRO */}
						{quizStep === "intro" && (
							<div className="flex flex-col items-center justify-center text-center py-10 my-auto w-full">
								<BrainIcon className="size-16 text-emerald-800 mb-6 animate-pulse" />
								<h3 className="text-2xl font-playfair text-slate-950 font-normal">
									{language === "fr" ? "Trouvez la bonne catégorie" : "Find the right category"}
								</h3>
								<p className="text-slate-500 text-sm max-w-sm mt-3 leading-relaxed">
									{language === "fr" ? "Choisissez simplement ce que vous cherchez. Le quiz vous montrera un produit réel du catalogue." : "Just pick what you are looking for. The quiz will show a real product from the catalog."}
								</p>
								<Button
									onClick={() => setQuizStep("category")}
									className="mt-8 bg-emerald-900 hover:bg-emerald-950 text-white font-bold h-12 px-8 rounded-full shadow-xs cursor-pointer"
								>
									{language === "fr" ? "Choisir une catégorie →" : "Choose a category →"}
								</Button>
							</div>
						)}						{/* Step: CATEGORY */}
						{quizStep === "category" && (
							<div className="space-y-6 my-auto w-full">
								<div>
									<span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
										{language === "fr" ? "Étape 1 sur 1" : "Step 1 of 1"}
									</span>
									<h3 className="text-xl sm:text-2xl font-playfair text-slate-950 font-normal mt-1">
										{language === "fr" ? "Quelle catégorie correspond à votre besoin ?" : "Which category matches what you need?"}
									</h3>
								</div>
								{loadingProducts ? (
									<div className="rounded-2xl border border-dashed border-emerald-900/15 bg-white p-6 text-center">
										<p className="text-sm text-slate-500">
											{language === "fr" ? "Les produits du catalogue sont encore en chargement." : "The catalog products are still loading."}
										</p>
									</div>
								) : quizChoices.length === 0 ? (
									<div className="rounded-2xl border border-dashed border-emerald-900/15 bg-white p-6 text-center">
										<p className="text-sm text-slate-500">
											{language === "fr"
												? "Aucune catégorie correspondante n'est encore disponible dans le catalogue."
												: "No matching category is available in the catalog yet."}
										</p>
									</div>
								) : (
									<div className="grid gap-3 sm:grid-cols-2">
										{quizChoices.map((choice) => {
											const Icon = quizIcons[choice.id];
											const { label, description } = getQuizChoiceCopy(choice, language);
											return (
												<button
													key={choice.id}
													onClick={() => {
														setQuizTarget(choice.id);
														setQuizStep("result");
													}}
													className="p-4 bg-white rounded-2xl border border-emerald-900/10 hover:border-emerald-700 hover:bg-emerald-50/20 text-left transition-all duration-150 cursor-pointer shadow-2xs group"
												>
													<div className="flex items-start gap-3">
														<div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
															<Icon className="size-5" />
														</div>
														<div className="min-w-0 flex-1">
															<div className="flex items-center justify-between gap-2">
																<p className="text-sm font-bold text-slate-900 leading-tight">{label}</p>
																<span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
																	{choice.productCount}
																</span>
															</div>
															<p className="mt-1 text-[11px] text-slate-400">{description}</p>
															<p className="mt-2 text-[11px] font-semibold text-emerald-800">
																{choice.sampleProduct ? choice.sampleProduct.name : (language === "fr" ? "Produit disponible" : "Available product")}
															</p>
														</div>
													</div>
												</button>
											);
										})}
									</div>
								)}
								<div className="flex justify-between items-center pt-4">
									<Button variant="ghost" onClick={() => setQuizStep("intro")} className="text-emerald-900 hover:bg-emerald-50 rounded-xl cursor-pointer">
										&larr; {language === "fr" ? "Retour" : "Back"}
									</Button>
								</div>
							</div>
						)}

						{/* Step: RESULT */}
						{quizStep === "result" && recommendedProduct && selectedQuizChoice && (
							<div className="space-y-6 w-full animate-slide-up">
								<div>
									<span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
										{language === "fr" ? "Votre recommandation" : "Your recommendation"}
									</span>
									<h3 className="text-xl sm:text-2xl font-playfair text-slate-950 font-normal mt-1">
										{language === "fr"
											? "Voici un produit réel du catalogue qui correspond à votre catégorie."
											: "Here is a real catalog product that matches your category."}
									</h3>
								</div>

								<div className="flex flex-col md:flex-row gap-6 p-4 sm:p-6 bg-white rounded-2xl border border-emerald-900/10 shadow-md">
									<div className="size-28 sm:size-36 shrink-0 bg-slate-50 border border-slate-100 rounded-xl p-2 flex items-center justify-center mx-auto md:mx-0">
										<img src={recommendedProduct.image} alt={recommendedProduct.name} className="h-full object-contain" />
									</div>

									<div className="flex-1 text-center md:text-left flex flex-col justify-between">
										<div>
											<span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider bg-emerald-50 border border-emerald-900/5 px-2.5 py-0.5 rounded-full inline-block">
												{language === "fr" ? selectedQuizChoice.labelFr : selectedQuizChoice.labelEn}
											</span>
											<h4 className="text-xl font-playfair font-bold text-slate-950 mt-1.5">
												{recommendedProduct.name}
											</h4>
											<p className="text-xs text-slate-500 mt-2 leading-relaxed">
												{language === "fr" ? (
													<>
														Cette sélection vient de la catégorie{" "}
														<strong className="text-emerald-950 font-sans">{selectedQuizChoice.labelFr}</strong>
														, avec {selectedQuizChoice.productCount} produit
														{selectedQuizChoice.productCount > 1 ? "s" : ""} disponible
														{selectedQuizChoice.productCount > 1 ? "s" : ""} dans le catalogue.
													</>
												) : (
													<>
														This pick comes from the{" "}
														<strong className="text-emerald-950 font-sans">{selectedQuizChoice.labelEn}</strong>{" "}
														category, which has {selectedQuizChoice.productCount} product
														{selectedQuizChoice.productCount > 1 ? "s" : ""} in the catalog.
													</>
												)}
											</p>
										</div>

										<div className="mt-4 flex items-center justify-between flex-wrap gap-2 border-t border-slate-50 pt-3">
											<span className="text-lg font-black text-slate-900">{recommendedProduct.price}</span>
											<div className="flex gap-2 w-full sm:w-auto">
												<Button
													onClick={() => {
														addItem(recommendedProduct);
														toast.success(language === "fr" ? `${recommendedProduct.name} ajouté au panier !` : `${recommendedProduct.name} added to cart!`);
													}}
													className="flex-1 sm:flex-initial h-10 px-5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
												>
													<ShoppingBagIcon className="size-3.5" />
													{t("common.addToCart")}
												</Button>
												<Button
													variant="outline"
													onClick={() => navigate(`/product/${recommendedProduct.id}`)}
													className="h-10 px-4 rounded-xl border-emerald-900/15 text-emerald-800 hover:bg-emerald-50 cursor-pointer animate-in duration-200"
												>
													{language === "fr" ? "Détails" : "Details"}
												</Button>
											</div>
										</div>
									</div>
								</div>

								<div className="flex justify-between gap-3 pt-2">
									<Button
										variant="ghost"
										onClick={() => setQuizStep("category")}
										className="text-slate-500 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-bold uppercase tracking-wider"
									>
										{language === "fr" ? "Choisir une autre catégorie" : "Choose another category"}
									</Button>
									<Button
										variant="ghost"
										onClick={resetQuiz}
										className="text-slate-500 hover:bg-slate-50 rounded-xl cursor-pointer text-xs font-bold uppercase tracking-wider"
									>
										{language === "fr" ? "Recommencer" : "Start over"}
									</Button>
								</div>
							</div>
						)}

						{quizStep === "result" && (!recommendedProduct || !selectedQuizChoice) && (
							<div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
								<p className="max-w-sm text-sm leading-relaxed text-slate-500">
									{language === "fr"
										? "Nous n'avons pas encore trouvé de produit correspondant. Choisissez une autre catégorie ou réessayez après la synchronisation du catalogue."
										: "We could not find a matching product yet. Choose another category or try again once the catalog finishes syncing."}
								</p>
								<div className="flex flex-wrap justify-center gap-2">
									<Button
										onClick={() => setQuizStep("category")}
										className="bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl font-bold cursor-pointer"
									>
										{language === "fr" ? "Choisir une catégorie" : "Choose a category"}
									</Button>
									<Button
										variant="ghost"
										onClick={resetQuiz}
										className="text-slate-500 hover:bg-slate-50 rounded-xl cursor-pointer"
									>
										{language === "fr" ? "Recommencer" : "Start over"}
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</section>


			{/* First Section: Products Slider */}
			<section id="products" className="bg-white py-16 border-b border-emerald-900/10">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
						<div className="flex-1">
							<p className="text-xs font-black uppercase tracking-widest text-emerald-700">{language === "fr" ? "Meilleures ventes" : "Best sellers"}</p>
							<h2 className="mt-2 text-3xl font-playfair font-normal tracking-tight text-slate-950 sm:text-4xl">{language === "fr" ? "Formules à fort impact." : "High-impact formulas."}</h2>
							<p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">{language === "fr" ? "Chaque produit est conçu pour s'intégrer facilement dans votre quotidien : un but clair, des ingrédients propres et des saveurs agréables." : "Each product is built to feel easy in real life: clear purpose, clean ingredients, and flavors that make consistency simpler."}</p>
						</div>
						<div className="flex items-center gap-1.5 self-start sm:self-end">
							<Button
								variant="outline"
								size="icon"
								className="h-9 w-9 rounded-lg border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950"
								onClick={() => scrollProductSlider("left")}
								aria-label="Scroll left"
							>
								<ChevronLeftIcon className="size-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="h-9 w-9 rounded-lg border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950"
								onClick={() => scrollProductSlider("right")}
								aria-label="Scroll right"
							>
								<ChevronRightIcon className="size-4" />
							</Button>
						</div>
					</div>

					<div
						ref={productSliderRef}
						className="flex overflow-x-auto gap-6 pb-6 scroll-smooth snap-x snap-mandatory scrollbar-none"
					>
						{loadingProducts ? (
							<motion.div
								key="products-loading"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="flex min-h-[420px] w-full items-center justify-center"
							>
								<div className="flex flex-col items-center gap-3 rounded-3xl border border-emerald-900/5 bg-white px-8 py-10 shadow-sm">
									<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-950" />
									<p className="text-xs font-semibold text-slate-500">
										{language === "fr" ? "Chargement des produits..." : "Loading products..."}
									</p>
								</div>
							</motion.div>
						) : products.length === 0 ? (
							<motion.div
								key="products-empty"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="flex min-h-[420px] w-full items-center justify-center"
							>
								<div className="max-w-md rounded-3xl border border-dashed border-emerald-900/15 bg-white px-8 py-10 text-center shadow-sm">
									<h3 className="text-lg font-playfair font-semibold text-slate-950">
										{language === "fr" ? "Aucun produit disponible" : "No products available"}
									</h3>
									<p className="mt-2 text-sm leading-6 text-slate-500">
										{language === "fr"
											? "Les produits du backend s'afficheront ici dès qu'ils seront publiés."
											: "Backend products will appear here as soon as they are published."}
									</p>
								</div>
							</motion.div>
						) : (
							products.map((product) => (
								<motion.article
									key={product.id}
									whileHover={{ y: -8 }}
									transition={{ duration: 0.12, ease: "easeOut" }}
									onClick={() => navigate(`/product/${product.id}`)}
									className="snap-start shrink-0 w-[290px] sm:w-[330px] rounded-[2rem] border border-emerald-950/5 bg-white p-4 shadow-md hover:shadow-lg transition-shadow duration-150 flex flex-col justify-between group cursor-pointer"
								>
									<div>
										<div className="relative h-80 overflow-hidden rounded-[1.5rem] bg-white border border-gray-100/60">
											<span className="absolute left-3 top-3 z-10 rounded-full bg-white/80 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-emerald-900 border border-white/20 shadow-sm">
												{product.badge}
											</span>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													if (isBookmarked(product.id)) {
														removeBookmark(product.id);
														toast.success(language === "fr" ? `${product.name} retiré des favoris.` : `Removed ${product.name} from wishlist.`);
													} else {
														addBookmark(product);
														toast.success(language === "fr" ? `${product.name} ajouté aux favoris !` : `Added ${product.name} to wishlist!`);
													}
												}}
												className="absolute right-3 top-3 z-10 size-9 rounded-full bg-white/95 text-slate-700 shadow-sm border border-slate-100 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
												title={isBookmarked(product.id) ? (language === "fr" ? "Retirer des favoris" : "Remove from Wishlist") : (language === "fr" ? "Ajouter aux favoris" : "Add to Wishlist")}
											>
												<HeartIcon className={cn("size-4 transition-colors", isBookmarked(product.id) ? "fill-rose-500 text-rose-500" : "text-slate-500")} />
											</button>
											<img
												src={product.image}
												alt={product.name}
												className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-105"
											/>
										</div>
										<div className="mt-5 px-1">
											<p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
												{product.category}
											</p>
											<div className="mt-2 flex items-baseline justify-between gap-2">
												<h3 className="text-xl font-playfair font-semibold leading-tight text-slate-950">
													{product.name}
												</h3>
												<p className="text-base font-bold text-slate-900 shrink-0">{product.price}</p>
											</div>
											<p className="mt-1.5 text-sm text-slate-500 font-sans">{product.flavor}</p>
										</div>
									</div>

									<OriginButton
										variant="emerald"
										onClick={(e) => {
											e.stopPropagation();
											addItem(product);
											toast.success(language === "fr" ? `${product.name} ajouté au panier !` : `${product.name} added to cart!`);
										}}
										className="mt-5 w-full h-10 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
									>
										<ShoppingBagIcon className="size-3.5" />
										{t("common.addToCart")}
									</OriginButton>
								</motion.article>
							))
						)}
					</div>

					{/* Centered See All Products button at the bottom of the slider */}
					<div className="mt-10 flex justify-center">
						<Button
							asChild
							variant="outline"
							className="rounded-xl border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950 font-bold px-6 py-5"
						>
							<Link to={APP_ROUTES.SHOP}>
								{language === "fr" ? "Voir tous les produits" : "See all products"}
								<ArrowRightIcon className="ml-2 size-4" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Formulations Section */}
			<section id="formulations" className="bg-[#fcfdfa] py-20 border-b border-emerald-900/10">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<p className="text-xs font-black uppercase tracking-widest text-emerald-700">{language === "fr" ? "Formulations" : "Formulations"}</p>
						<h2 className="mt-2 text-3xl font-playfair font-normal leading-tight text-slate-950 sm:text-5xl">
							{language === "fr" ? "Formulations scientifiques" : "Science-backed formulations"}
						</h2>
						<p className="mt-4 mx-auto max-w-2xl text-base leading-relaxed text-slate-500">
							{language === "fr"
								? "Nos mélanges ciblés s'appuient sur de vrais produits du backend pour soutenir votre vitalité avec des choix précis."
								: "Our targeted blends now feature real backend products to support vitality with sharper, more accurate picks."}
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-3">
						{loadingProducts ? (
							Array.from({ length: 3 }).map((_, index) => (
								<div
									key={index}
									className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5] border border-emerald-900/10 bg-white p-6 sm:p-8 shadow-lg"
								>
									<div className="h-full animate-pulse rounded-[2rem] bg-emerald-50/70" />
								</div>
							))
						) : formulationCards.length > 0 ? (
							formulationCards.map((item, index) => {
								const summary =
									item.product.description?.trim() ||
									(language === "fr"
										? "Produit réel synchronisé depuis le backend."
										: "Real product synced from the backend.");
								const shortSummary = summary.length > 118 ? `${summary.slice(0, 115).trimEnd()}...` : summary;

								return (
									<motion.article
										key={item.product.id}
										initial={{ opacity: 0, y: 30 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.34, delay: index * 0.08 }}
										onClick={() => navigate(`/product/${item.product.id}`)}
										className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5] p-6 sm:p-8 flex flex-col justify-between shadow-lg border border-emerald-900/10 group cursor-pointer bg-slate-950"
									>
										<div
											className="absolute inset-0 bg-cover bg-center transition-transform duration-150 ease-out group-hover:scale-105"
											style={{
												backgroundImage: item.product.image ? `url(${item.product.image})` : undefined,
												backgroundColor: item.product.image ? undefined : "rgba(15, 23, 42, 0.96)",
											}}
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/30 to-black/40 group-hover:from-emerald-950/90 group-hover:via-emerald-950/35 transition-colors duration-150" />

										<div className="relative z-10">
											<span className="inline-block bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold">
												{language === "fr" ? item.badgeFr : item.badgeEn}
											</span>
											<h3 className="mt-5 text-2xl sm:text-3xl font-playfair font-normal leading-tight text-white max-w-[240px]">
												{language === "fr" ? item.titleFr : item.titleEn}
											</h3>
										</div>

										<div className="relative z-10 rounded-[1.5rem] border border-white/15 bg-white/92 p-4 shadow-xl shadow-black/10 backdrop-blur-sm">
											<p className="text-xs uppercase tracking-[0.2em] text-emerald-800 font-black">
												{item.product.category}
											</p>
											<h4 className="mt-1 text-lg font-semibold text-slate-950">
												{item.product.name}
											</h4>
											<p className="mt-2 text-sm leading-6 text-slate-600">{shortSummary}</p>
											<div className="mt-4 flex flex-wrap items-center justify-between gap-3">
												<span className="text-base font-black text-slate-950">{item.product.price}</span>
												<div className="flex flex-wrap gap-2">
													<OriginButton
														variant="emerald"
														onClick={(e) => {
															e.stopPropagation();
															addItem(item.product);
															toast.success(language === "fr" ? `${item.product.name} ajouté au panier !` : `${item.product.name} added to cart!`);
														}}
														className="h-10 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
													>
														<ShoppingBagIcon className="size-3.5" />
														{t("common.addToCart")}
													</OriginButton>
													<Button
														variant="outline"
														onClick={(e) => {
															e.stopPropagation();
															navigate(`/product/${item.product.id}`);
														}}
														className="h-10 px-4 rounded-xl border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950"
													>
														{language === "fr" ? "Voir" : "View"}
													</Button>
												</div>
											</div>
										</div>
									</motion.article>
								);
							})
						) : (
							<div className="md:col-span-3 rounded-[2rem] border border-dashed border-emerald-900/15 bg-white px-8 py-10 text-center shadow-sm">
								<h3 className="text-lg font-playfair font-semibold text-slate-950">
									{language === "fr" ? "Aucune formulation disponible" : "No formulations available"}
								</h3>
								<p className="mt-2 text-sm leading-6 text-slate-500">
									{language === "fr"
										? "Les produits du backend n'ont pas encore été associés aux catégories clés."
										: "Backend products have not yet been assigned to the core categories."}
								</p>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* New Category Slider Section */}
			<motion.section
				variants={sectionLift}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.18 }}
				transition={{ duration: 0.34, ease: "easeOut" }}
				className="bg-gradient-to-b from-emerald-50/30 via-[#f6fbf2] to-[#fcfdfa] py-20 border-b border-emerald-900/10 overflow-hidden"
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
						<div className="flex-1">
							<p className="text-xs font-black uppercase tracking-widest text-emerald-700">{language === "fr" ? "Explorer les formules" : "Explore formulas"}</p>
							<h2 className="mt-2 text-3xl font-playfair font-normal tracking-tight text-slate-950 sm:text-4xl">{language === "fr" ? "Acheter par Catégorie." : "Shop by Category."}</h2>
							<p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
								{language === "fr" ? "Sélectionnez une catégorie pour filtrer. Chaque mélange est créé pour vous aider à atteindre vos objectifs de performance et de récupération." : "Select a category to filter. Each blend is created to help you reach target performance and recovery goals with zero fluff."}
							</p>
						</div>
						<div className="flex items-center gap-1.5 self-start sm:self-end">
							<Button
								variant="outline"
								size="icon"
								className="h-9 w-9 rounded-lg border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950"
								onClick={() => scrollCategorySlider("left")}
								aria-label="Scroll left"
							>
								<ChevronLeftIcon className="size-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="h-9 w-9 rounded-lg border-emerald-900/10 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950"
								onClick={() => scrollCategorySlider("right")}
								aria-label="Scroll right"
							>
								<ChevronRightIcon className="size-4" />
							</Button>
						</div>
					</div>

					{/* Category Tabs */}
					<div className="flex overflow-x-auto gap-2.5 pb-4 scrollbar-none snap-x mb-8">
						{categoryTabs.map((category) => {
							const isActive = activeCategoryId === category.id;
							return (
								<button
									key={category.id}
									onClick={() => setActiveCategoryId(category.id)}
									className={cn(
										"px-5 py-2 text-xs font-bold rounded-full border transition-all duration-200 cursor-pointer snap-start shrink-0 shadow-sm",
										isActive
											? "bg-emerald-950 text-white border-emerald-950 shadow-md shadow-emerald-950/10"
											: "bg-white text-emerald-800 border-emerald-900/10 hover:bg-emerald-50 hover:text-emerald-950 hover:-translate-y-0.5"
										)}
									>
									{category.label}
								</button>
							);
						})}
					</div>

					{/* Slider container */}
					<div
						ref={categorySliderRef}
						className="flex overflow-x-auto gap-6 pb-6 scroll-smooth snap-x snap-mandatory scrollbar-none min-h-[460px]"
					>
						<AnimatePresence mode="popLayout">
							{activeCategoryId !== "all" && loadingCategoryProducts ? (
								<motion.div
									key="category-loading"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="flex min-h-[420px] w-full items-center justify-center"
								>
									<div className="flex flex-col items-center gap-3 rounded-3xl border border-emerald-900/5 bg-white px-8 py-10 shadow-sm">
										<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-950" />
										<p className="text-xs font-semibold text-slate-500">
											{language === "fr" ? "Chargement des produits..." : "Loading products..."}
										</p>
									</div>
								</motion.div>
							) : displayedCategoryProducts.length === 0 ? (
								<motion.div
									key="category-empty"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="flex min-h-[420px] w-full items-center justify-center"
								>
									<div className="max-w-md rounded-3xl border border-dashed border-emerald-900/15 bg-white px-8 py-10 text-center shadow-sm">
										<h3 className="text-lg font-playfair font-semibold text-slate-950">
											{language === "fr" ? "Aucun produit dans cette catégorie" : "No products in this category"}
										</h3>
										<p className="mt-2 text-sm leading-6 text-slate-500">
											{language === "fr"
												? "Les produits apparaîtront ici dès que le backend les associera à cette catégorie."
												: "Products will appear here as soon as the backend assigns items to this category."}
										</p>
									</div>
								</motion.div>
							) : (
								displayedCategoryProducts.map((product) => (
								<motion.article
										key={product.id}
										variants={cardLift}
										layout
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										transition={{ duration: 0.16 }}
										whileHover={{ y: -6, rotate: -0.2 }}
										onClick={() => navigate(`/product/${product.id}`)}
										className="snap-start shrink-0 w-[290px] sm:w-[330px] rounded-[2rem] border border-emerald-950/5 bg-white p-4 shadow-md hover:shadow-xl hover:shadow-emerald-950/10 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
									>
										<div>
											<div className="relative h-80 overflow-hidden rounded-[1.5rem] bg-white border border-gray-100/60">
												<span className="absolute left-3 top-3 z-10 rounded-full bg-white/80 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-emerald-900 border border-white/20 shadow-sm">
													{product.badge || product.category}
												</span>
												<img
													src={product.image || heroProtein}
													alt={product.name}
													className="h-full w-full object-cover transition-transform duration-220 ease-out group-hover:scale-108"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-slate-950/15 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
											</div>
											<div className="mt-5 px-1">
												<p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
													{product.category}
												</p>
												<div className="mt-2 flex items-baseline justify-between gap-2">
													<h3 className="text-xl font-playfair font-semibold leading-tight text-slate-950">
														{product.name}
													</h3>
													<p className="text-base font-bold text-slate-900 shrink-0">{product.price}</p>
												</div>
												{product.flavor ? (
													<p className="mt-1.5 text-sm text-slate-500 font-sans">{product.flavor}</p>
												) : null}
											</div>
										</div>

										<OriginButton
											variant="emerald"
											onClick={(e) => {
												e.stopPropagation();
												addItem(product);
												toast.success(language === "fr" ? `${product.name} ajouté au panier !` : `${product.name} added to cart!`);
											}}
											className="mt-5 w-full h-10 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
										>
											<ShoppingBagIcon className="size-3.5" />
											{t("common.addToCart")}
										</OriginButton>
									</motion.article>
								)))}
						</AnimatePresence>
					</div>
				</div>
			</motion.section>

			<motion.section
				variants={sectionLift}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.16 }}
				transition={{ duration: 0.58, ease: "easeOut" }}
				className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
			>
				<div className="grid gap-8 overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white p-5 shadow-xl shadow-emerald-950/5 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
					<div className="lg:sticky lg:top-28">
						<SectionHeading
							kicker={language === "fr" ? "Sélection éditoriale" : "Editorial selection"}
							title={language === "fr" ? "Une vitrine plus guidée pour acheter plus vite." : "A more guided shelf for faster shopping."}
							copy={language === "fr"
								? "Cette section met en avant les routines qui se lisent d'un coup d'œil, avec des cartes plus visuelles et une hiérarchie très propre."
								: "This section puts the most shoppable routines front and center with clearer hierarchy and more visual cards."
							}
						/>

						<div className="mt-8 space-y-3">
							{[
								language === "fr" ? "Vue rapide des routines" : "Quick routine scan",
								language === "fr" ? "Cartes produit plus visuelles" : "More visual product cards",
								language === "fr" ? "Accès direct à la boutique" : "Direct access to shop",
							].map((item) => (
								<div key={item} className="flex items-center gap-3 rounded-2xl border border-emerald-900/6 bg-emerald-50/50 px-4 py-3 text-sm font-semibold text-slate-700">
									<Check className="size-4 text-emerald-700" />
									{item}
								</div>
							))}
						</div>

						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Button asChild className="h-11 rounded-xl bg-emerald-900 text-white hover:bg-emerald-950">
								<Link to={APP_ROUTES.SHOP}>
									{language === "fr" ? "Voir la boutique" : "Browse the shop"}
									<ArrowRightIcon className="ml-2 size-4" />
								</Link>
							</Button>
							<Button asChild variant="outline" className="h-11 rounded-xl border-emerald-900/10 text-emerald-800 hover:bg-emerald-50">
								<Link to={APP_ROUTES.SHOP}>
									{language === "fr" ? "Parcourir les produits" : "Browse products"}
								</Link>
							</Button>
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						{routineHighlights.map((item, index) => (
							<motion.article
								key={item.title}
								variants={cardLift}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, amount: 0.2 }}
								transition={{ duration: 0.32 + index * 0.04, ease: "easeOut" }}
								whileHover={{ y: -8, rotate: index % 2 === 0 ? -0.35 : 0.35 }}
								className="group overflow-hidden rounded-[1.75rem] border border-emerald-900/8 bg-[#fbfdf9] shadow-sm transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/10"
							>
								<div className="relative aspect-[4/3] overflow-hidden bg-white">
									<img
										src={item.image}
										alt={item.product?.name || item.title}
										className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
									<span className={`absolute left-3 top-3 rounded-full border border-white/40 bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${item.tone}`}>
										{item.product?.category || (language === "fr" ? "Sélection" : "Selection")}
									</span>
								</div>

								<div className="space-y-3 p-4">
									<div>
										<h3 className="text-lg font-black leading-tight text-slate-950">{item.title}</h3>
										<p className="mt-2 text-sm leading-6 text-slate-500">{item.copy}</p>
									</div>

									<div className="flex items-center justify-between gap-3">
										<div>
											<p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
												{language === "fr" ? "Produit en vedette" : "Featured product"}
											</p>
											<p className="mt-1 text-sm font-bold text-slate-900">{item.product?.name || (language === "fr" ? "À découvrir" : "Discover now")}</p>
										</div>
										{item.product && (
											<p className="text-sm font-black text-emerald-900">{item.product.price}</p>
										)}
									</div>

									<div className="flex items-center gap-2">
										<Button
											asChild
											variant="outline"
											className="h-10 flex-1 rounded-xl border-emerald-900/10 text-emerald-800 hover:bg-emerald-50"
										>
											<Link to={item.product ? `/product/${item.product.id}` : APP_ROUTES.SHOP}>
												{language === "fr" ? "Voir le produit" : "View product"}
											</Link>
										</Button>
										<Button
											type="button"
											variant="default"
											className="h-10 rounded-xl bg-emerald-900 px-4 text-white hover:bg-emerald-950"
											onClick={() => navigate(APP_ROUTES.SHOP)}
										>
											<ArrowRightIcon className="size-4" />
										</Button>
									</div>
								</div>
							</motion.article>
						))}
					</div>
				</div>
			</motion.section>

			<motion.section
				id="proof"
				variants={sectionLift}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.22 }}
				transition={{ duration: 0.58, ease: "easeOut" }}
				className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
			>
				<div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
					<div>
						<SectionHeading
							kicker={language === "fr" ? "Conçu pour la confiance" : "Built for trust"}
							title={language === "fr" ? "L'achat de compléments bien-être devrait rendre les preuves faciles à voir." : "Wellness shopping should make the evidence easy to see."}
							copy={language === "fr" ? "Au lieu de vagues promesses, Zamazor explique chaque formule par des notes d'ingrédients claires, des conseils de routine et des contrôles de qualité." : "Instead of vague promises, Zamazor explains each formula through clean ingredient notes, routine guidance, quality checks, and proof points that help customers choose with confidence."}
						/>
						<div className="mt-8 grid grid-cols-2 gap-3">
							{proofStats.map((stat) => (
								<motion.div
									key={stat.label}
									initial={{ opacity: 0, y: 18 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.5 }}
									transition={{ duration: 0.45 }}
									className="rounded-lg border border-emerald-900/10 bg-white p-4 shadow-sm"
								>
									<p className="text-3xl font-black text-emerald-800">
										{stat.value}
									</p>
									<p className="mt-2 text-sm leading-5 text-slate-600">
										{stat.label}
									</p>
								</motion.div>
							))}
						</div>
					</div>

					<motion.div
						initial={{ opacity: 0, scale: 0.96 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true, amount: 0.35 }}
						transition={{ duration: 0.55, ease: "easeOut" }}
						className="overflow-hidden rounded-lg border border-emerald-900/10 bg-white shadow-xl shadow-emerald-950/10"
					>
						<div className="grid sm:grid-cols-2">
							<div className="bg-[#eff8e8] p-5">
								<p className="text-xs font-black uppercase text-emerald-700">
									{language === "fr" ? "Avant" : "Before"}
								</p>
								<h3 className="mt-3 text-2xl font-black text-slate-950">
									{language === "fr" ? "Compléments aléatoires, résultats flous." : "Random supplements, unclear results."}
								</h3>
								<ul className="mt-5 space-y-3 text-sm text-slate-600">
									<li>{language === "fr" ? "Plusieurs flacons avec des ingrédients redondants" : "Multiple bottles with overlapping ingredients"}</li>
									<li>{language === "fr" ? "Pas d'ordre clair pour le matin ou les jours d'entraînement" : "No clear order for morning or training days"}</li>
									<li>{language === "fr" ? "Difficile de savoir quoi recommander" : "Hard to know what to reorder"}</li>
								</ul>
							</div>
							<div className="bg-emerald-950 p-5 text-white">
								<p className="text-xs font-black uppercase text-lime-300">
									{language === "fr" ? "Après" : "After"}
								</p>
								<h3 className="mt-3 text-2xl font-black">
									{language === "fr" ? "Un stack simple adapté à votre routine." : "A simple stack matched to your daily routine."}
								</h3>
								<ul className="mt-5 space-y-3 text-sm text-emerald-50/80">
									<li>{language === "fr" ? "Objectifs clairs pour l'énergie, la force et la récupération" : "Clear goals for energy, strength, and recovery"}</li>
									<li>{language === "fr" ? "Contrôles d'abonnement faciles" : "Easy subscription controls"}</li>
									<li>{language === "fr" ? "Preuve de formule affichée avant le paiement" : "Formula proof shown before checkout"}</li>
								</ul>
							</div>
						</div>
						<div className="grid grid-cols-3 border-t border-emerald-900/10 bg-white text-center">
							{[(language === "fr" ? "Énergie" : "Energy"), (language === "fr" ? "Force" : "Strength"), (language === "fr" ? "Récupération" : "Recovery")].map((label) => (
								<div
									key={label}
									className="border-r border-emerald-900/10 p-4 last:border-r-0"
								>
									<p className="text-sm font-black text-emerald-800">{label}</p>
									<p className="mt-1 text-xs text-slate-500">{language === "fr" ? "soutien de routine" : "routine support"}</p>
								</div>
							))}
						</div>
					</motion.div>
				</div>
			</motion.section>

			<motion.section
				variants={sectionLift}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.18 }}
				transition={{ duration: 0.58, ease: "easeOut" }}
				className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
			>
				<div className="grid gap-10 rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-950/5 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
					<div>
						<SectionHeading
							kicker={language === "fr" ? "Comparez clairement" : "Compare clearly"}
							title={language === "fr" ? "Des routines plus propres valent mieux que des placards encombrés." : "Cleaner routines beat crowded cabinets."}
							copy={language === "fr" ? "Découvrez comment Zamazor simplifie votre stack de compléments par rapport aux boutiques de vitamines commerciales typiques." : "See how Zamazor simplifies your supplement stack compared to typical commercial vitamin stores."}
						/>
						<div className="mt-8 space-y-4">
							<div className="flex items-start gap-3">
								<span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800 mt-1">
									<Check className="size-3" />
								</span>
								<p className="text-sm text-slate-600 font-sans leading-relaxed">
									<strong>{language === "fr" ? "Dosage scientifique :" : "Scientifically dosed:"}</strong>{language === "fr" ? " Pas de mélanges brevetés de remplissage. Vous connaissez exactement le dosage en milligrammes de chaque ingrédient." : " No filler proprietary blends. You know exactly how many milligrams of every ingredient you ingest."}
								</p>
							</div>
							<div className="flex items-start gap-3">
								<span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800 mt-1">
									<Check className="size-3" />
								</span>
								<p className="text-sm text-slate-600 font-sans leading-relaxed">
									<strong>{language === "fr" ? "Zéro cochonnerie artificielle :" : "Zero artificial junk:"}</strong>{language === "fr" ? " Sucré naturellement, coloré naturellement et facile à digérer." : " Naturally sweetened, naturally colored, and easy on your digestion."}
								</p>
							</div>
						</div>
					</div>

					<div className="overflow-hidden rounded-2xl border border-emerald-900/10 shadow-sm">
						<div className="grid grid-cols-[1.2fr_1fr_1fr] bg-slate-950 text-xs sm:text-sm font-bold text-white items-center">
							<div className="p-4 sm:p-5">{language === "fr" ? "Caractéristique" : "Feature"}</div>
							<div className="bg-emerald-900/40 p-4 sm:p-5 text-center text-lime-300 font-extrabold border-x border-white/5">
								Zamazor
							</div>
							<div className="p-4 sm:p-5 text-center text-slate-400">{language === "fr" ? "Boutique typique" : "Typical store"}</div>
						</div>
						{comparisonData.map((row) => (
							<div
								key={row.feature}
								className="grid grid-cols-[1.2fr_1fr_1fr] border-t border-emerald-900/10 text-xs sm:text-sm items-center"
							>
								<div className="p-4 sm:p-5 font-bold text-slate-900 leading-snug">
									{row.feature}
								</div>
								<div className="bg-emerald-50/50 p-4 sm:p-5 text-emerald-950 font-semibold border-x border-emerald-900/5 h-full flex flex-col justify-center items-center text-center gap-1.5">
									<Check className="size-4 text-emerald-700 bg-emerald-100/80 rounded-full p-0.5 shrink-0" />
									<span className="text-[11px] sm:text-xs leading-tight text-emerald-800">{row.zamazor.text}</span>
								</div>
								<div className="p-4 sm:p-5 text-slate-500 h-full flex flex-col justify-center items-center text-center gap-1.5">
									<X className="size-4 text-slate-400 bg-slate-100 rounded-full p-0.5 shrink-0" />
									<span className="text-[11px] sm:text-xs leading-tight text-slate-500">{row.typical.text}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</motion.section>

			<motion.section
				id="stack"
				variants={sectionLift}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.14 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-b border-emerald-900/10"
			>
				<div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
					<div className="lg:sticky lg:top-28">
						<SectionHeading
							kicker={language === "fr" ? "Stack quotidien" : "Daily stack"}
							title={language === "fr" ? "Une meilleure routine est plus simple quand les étapes sont claires." : "A better routine is easier when the steps are obvious."}
							copy={language === "fr" ? "Les stacks de Zamazor sont conçus autour des moments qui comptent le plus : l'énergie matinale, l'entraînement ciblé et la récupération nocturne." : "Zamazor stacks are designed around the moments that matter most: morning energy, focused training, and real recovery at night."}
						/>
						<div className="mt-8 rounded-2xl bg-emerald-50/50 border border-emerald-900/5 p-6">
							<h4 className="font-playfair text-lg font-bold text-emerald-950">{language === "fr" ? "Pourquoi choisir les stacks" : "Why Stacking Works"}</h4>
							<p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
								{language === "fr" ? "Prendre des vitamines au hasard réduit l'absorption et crée de la friction dans les habitudes. En regroupant les nutriments complémentaires le matin, à l'entraînement et le soir, vous gagnez en régularité et en efficacité." : "Taking vitamins at random times reduces absorption and creates habit friction. By grouping complementary nutrients into fixed morning, training, and evening windows, you build consistency and amplify efficacy."}
							</p>
						</div>
					</div>

					<div className="relative pl-6 sm:pl-8">
						{/* Timeline vertical path */}
						<div className="absolute left-[23px] sm:left-[31px] top-4 bottom-4 w-0.5 bg-emerald-900/10 border-dashed border-l" />

						<motion.div
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.15 }}
							transition={{ staggerChildren: 0.12 }}
							className="space-y-8"
						>
							{detailedStackSteps.map(({ title, copy, icon: Icon, time, moment, products, color }, index) => (
								<motion.div
									key={title}
									variants={fadeUp}
									className="relative group flex gap-6 rounded-2xl border border-emerald-900/5 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-emerald-900/20 transition-all duration-150"
								>
									{/* Timeline Node Bullet */}
									<div className="absolute -left-[38px] sm:-left-[47px] top-6 z-10 flex size-8 sm:size-10 items-center justify-center rounded-full bg-white border border-emerald-900/10 shadow-xs group-hover:border-emerald-700 transition-colors">
										<span className={cn("flex size-6 sm:size-8 items-center justify-center rounded-full text-xs font-bold", color)}>
											<Icon className="size-3 sm:size-4" />
										</span>
									</div>

									<div className="flex-1">
										<div className="flex flex-wrap items-center justify-between gap-2">
											<span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
												{language === "fr" ? `Étape ${index + 1} \u2022 ${moment}` : `Step ${index + 1} \u2022 ${moment}`}
											</span>
											<span className="text-xs font-bold text-slate-500 font-mono">
												{time}
											</span>
										</div>

										<h3 className="mt-3 text-lg sm:text-xl font-playfair font-bold text-slate-950">
											{title}
										</h3>
										<p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-sans">
											{copy}
										</p>

										{/* Interactive Supplement tags */}
										<div className="mt-4 flex flex-wrap gap-1.5 items-center">
											<span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">{language === "fr" ? "Recommandé :" : "Recommended:"}</span>
											{products.map((prod) => (
												<span
													key={prod}
													className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-50 text-emerald-900 border border-slate-100 hover:border-emerald-900/20 hover:bg-emerald-50/20 transition-colors cursor-pointer"
												>
													{prod}
												</span>
											))}
										</div>
									</div>
								</motion.div>
							))}
						</motion.div>
					</div>
				</div>
			</motion.section>
			<motion.section
				id="reviews"
				variants={sectionLift}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.16 }}
				transition={{ duration: 0.56, ease: "easeOut" }}
				className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
			>
				<SectionHeading
					kicker={language === "fr" ? "Avis clients" : "Customer love"}
					title={language === "fr" ? "Conçu pour ceux qui veulent un bien-être en toute simplicité." : "Designed for people who want wellness to feel simple."}
				/>

				<div className="mt-9 grid gap-5 md:grid-cols-3">
					{reviews.map((review) => (
						<motion.article
							key={review.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.35 }}
							transition={{ duration: 0.5 }}
							className="rounded-lg border border-emerald-900/10 bg-white p-5 shadow-sm"
						>
							<div className="flex gap-1 text-amber-400">
								{Array.from({ length: 5 }).map((_, index) => (
									<StarIcon
										key={index}
										className="size-4 fill-current"
										aria-hidden="true"
									/>
								))}
							</div>
							<p className="mt-5 text-base leading-7 text-slate-700">
								"{review.quote}"
							</p>
							<div className="mt-6">
								<p className="font-black text-slate-950">{review.name}</p>
								<p className="text-sm text-slate-500">{review.meta}</p>
							</div>
						</motion.article>
					))}
				</div>
			</motion.section>

			{/* Supplement & Order FAQs Section */}
			<motion.div
				variants={sectionLift}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.16 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="bg-[#fcfdfa] border-t border-b border-emerald-900/5"
			>
				<FAQSection
					title={language === "fr" ? "Support des Compléments & Commandes" : "Supplement & Order Support"}
					subtitle={language === "fr" ? "Questions Fréquemment Posées" : "Frequently Asked Questions"}
					description={language === "fr" ? "Réponses rapides aux questions courantes sur nos ingrédients biologiques, la livraison, les abonnements et les normes de sécurité." : "Quick answers to common questions about our organic ingredients, shipping, subscriptions, and safety standards."}
					buttonLabel={language === "fr" ? "Aller au Centre d'Aide" : "Go to Help Center"}
					onButtonClick={() => {
						navigate(APP_ROUTES.HELP);
					}}
					faqsLeft={[
						{
							question: language === "fr" ? "Les formules de compléments Zamazor sont-elles certifiées biologiques et sans OGM ?" : "Are Zamazor supplement formulas certified organic and non-GMO?",
							answer: language === "fr" ? "Oui, tous nos mélanges sont formulés avec des extraits de plantes et minéraux 100% biologiques, sans OGM et propres. Nous n'utilisons jamais de colorants, d'arômes, d'édulcorants artificiels ou de liants chimiques synthétiques." : "Yes, all our supplement blends are crafted using 100% organic, non-GMO, clean botanical extracts and minerals. We never use artificial colors, flavors, sweeteners, or synthetic chemical binders.",
						},
						{
							question: language === "fr" ? "Comment dois-je conserver mes boîtes de compléments Zamazor ?" : "How do I store Zamazor supplement canisters?",
							answer: language === "fr" ? "Nous recommandons de conserver vos boîtes dans un endroit frais et sec, à l'abri de la lumière directe du soleil et de la chaleur. Veillez à bien refermer le couvercle après chaque utilisation pour éviter l'humidité." : "We recommend storing your canisters in a cool, dry pantry or cabinet, away from direct sunlight and heat. Always ensure the lid is sealed tightly after each serving to keep moisture out.",
						},
						{
							question: language === "fr" ? "Puis-je combiner différentes formules Zamazor dans un même shake ?" : "Can I combine different Zamazor formulas in one shake?",
							answer: language === "fr" ? "Absolument ! Nos produits sont conçus pour se compléter mutuellement. Mélanger notre protéine végétale avec notre mélange de superaliments dans votre smoothie du matin est un excellent choix riche en nutriments." : "Absolutely! Our products are designed to complement each other. Mixing our clean Protein powder with the organic Greens blend in your morning smoothie is a popular and nutrient-dense choice.",
						},
					]}
					faqsRight={[
						{
							question: language === "fr" ? "Comment fonctionne l'abonnement ?" : "How does the subscription plan work?",
							answer: language === "fr" ? "Notre programme d'abonnement livre automatiquement vos formules préférées à votre porte tous les 30 jours. Vous bénéficiez d'une réduction de 10% sur chaque commande et pouvez suspendre, sauter ou annuler à tout moment." : "Our subscription plan delivers your favorite supplement formulas to your door every 30 days automatically. You receive a 10% discount on every order and can pause, skip, or cancel at any time.",
						},
						{
							question: language === "fr" ? "Quelle est votre politique de livraison ?" : "What is your shipping policy?",
							answer: language === "fr" ? "Nous offrons la livraison standard gratuite sur toutes les commandes. Aucun achat minimum requis." : "We offer free standard shipping (3-5 business days) on all orders. No minimum purchase required.",
						},
						{
							question: language === "fr" ? "Proposez-vous une garantie de satisfaction ?" : "Do you offer a satisfaction guarantee?",
							answer: language === "fr" ? "Oui, nous sommes fiers de nos formules propres. Nous offrons une garantie de remboursement de 30 jours. Si vous n'êtes pas entièrement satisfait de votre stack, contactez-nous pour obtenir un remboursement rapide." : "Yes, we stand behind our clean formulas. We offer a 30-day money-back guarantee. If you are not completely satisfied with your supplement stack, contact us for a hassle-free refund.",
						},
					]}
				/>
			</motion.div>

			<motion.section
				variants={sectionLift}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.16 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="border-t border-emerald-900/10 bg-white py-10"
			>
				<div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
					{trustItems.map((item) => (
						<IconLabel key={item.label} icon={item.icon} label={item.label} />
					))}
				</div>
			</motion.section>

		</>
	);
};
