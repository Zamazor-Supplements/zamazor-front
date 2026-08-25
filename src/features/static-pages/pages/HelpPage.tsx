import CONFIG from "@/app/config/constants";
import { APP_ROUTES } from "@/app/routes/paths";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import {
	ArrowRightIcon,
	CheckCircle2Icon,
	ChevronRightIcon,
	Clock3Icon,
	CreditCardIcon,
	HelpCircleIcon,
	MessageSquareIcon,
	PackageIcon,
	PhoneIcon,
	RefreshCwIcon,
	SearchIcon,
	ShieldCheckIcon,
	SparklesIcon,
	TruckIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

const SUPPORT_TOPICS = [
	{
		id: "shipping",
		label: "Shipping & Delivery",
		icon: TruckIcon,
		description: "Track shipments, delivery times, and rates across Morocco.",
	},
	{
		id: "orders",
		label: "Orders & Payments",
		icon: CreditCardIcon,
		description: "Payment methods, order modifications, and invoices.",
	},
	{
		id: "returns",
		label: "Returns & Refunds",
		icon: RefreshCwIcon,
		description: "Return policies, damaged items, and refund timelines.",
	},
	{
		id: "products",
		label: "Product & Formulas",
		icon: ShieldCheckIcon,
		description: "Usage guides, ingredients, and bulk gym options.",
	},
];

interface SupportArticle {
	id: string;
	category: "Shipping" | "Orders" | "Returns" | "Products";
	title: string;
	summary: string;
	readTime: string;
}
const ARTICLES: SupportArticle[] = [
	{
		id: "track-order",
		category: "Shipping",
		title: "How do I track my order delivery in real time?",
		summary:
			"Once shipped, you will receive a tracking link via SMS or email. You can also enter your order number below.",
		readTime: "2 min read",
	},
	{
		id: "cancel-modify",
		category: "Orders",
		title: "Can I cancel or change my shipping address?",
		summary:
			"Orders are processed quickly. If you notify support within 2 hours of payment, we can update your order details.",
		readTime: "1 min read",
	},
	{
		id: "payment-methods",
		category: "Orders",
		title: "What payment methods are supported in Morocco?",
		summary:
			"We accept Cash on Delivery (COD), major credit cards, and local wire transfers.",
		readTime: "1 min read",
	},
	{
		id: "return-policy",
		category: "Returns",
		title: "What is the 14-day product return policy?",
		summary:
			"Unopened items in original packaging can be returned within 14 days of delivery. Contact support to initiate.",
		readTime: "3 min read",
	},
	{
		id: "damaged-goods",
		category: "Returns",
		title: "What should I do if my package arrives damaged?",
		summary:
			"Take photos of the damaged box/product immediately and send them with your order ID to support@zamazor.ma.",
		readTime: "2 min read",
	},
	{
		id: "bulk-discount",
		category: "Products",
		title: "How do bulk orders work for gyms and clubs?",
		summary:
			"We offer dedicated pricing tiers for fitness centers and bulk purchases. Visit our Bulk page or contact sales.",
		readTime: "2 min read",
	},
];

const POPULAR_SEARCHES = [
	"Tracking",
	"Refunds",
	"COD Payment",
	"Casablanca Delivery",
];
export default function HelpPage() {
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("All");

	// Order lookup state
	const [orderId, setOrderId] = useState<string | undefined>(undefined);
	const [lookupResult, setLookupResult] = useState<string | null>(null);

	useDocumentTitle(`Help Center | ${CONFIG.APP_NAME}`);

	// Filter articles based on category and search query
	const filteredArticles = useMemo(() => {
		return ARTICLES.filter((article) => {
			const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
			const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				article.summary.toLowerCase().includes(searchQuery.toLowerCase());

			return matchesCategory && matchesSearch;
		});
	}, [searchQuery, selectedCategory]);

	const handleOrderLookup = (e: React.FormEvent) => {
		e.preventDefault();
		if (!orderId) return;

		setLookupResult(
			`Order #${orderId.toUpperCase()} is currently in processing. Estimated delivery: 2-3 business days.`
		);
	};

	return (
		<div className="min-h-screen bg-[#fcfdfa] py-12 px-4 sm:px-6 lg:px-8 selection:bg-brand-100">
			<div className="mx-auto max-w-7xl space-y-12">
				{/* --- Hero Section with Live Search --- */}
				<div className="relative overflow-hidden rounded-hero border border-brand-900/10 bg-linear-to-br from-brand-950 via-brand-900 to-slate-950 p-8 sm:p-14 text-white shadow-xl shadow-brand-950/10">
					<div className="relative z-10 max-w-3xl">
						<div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-lime-300 backdrop-blur-md">
							<SparklesIcon className="size-3.5" />
							<span>24/7 Help Desk</span>
						</div>

						<h1 className="mt-4 text-3xl sm:text-5xl font-playfair font-normal leading-tight">
							How can we help you today?
						</h1>
						<p className="mt-3 text-sm sm:text-base leading-relaxed text-brand-100/80">
							Search our knowledge base, track your package, or speak directly
							with our team.
						</p>

						{/* Live Search Input */}
						<div className="mt-8 relative max-w-2xl">
							<SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search for help (e.g., shipping times, returns, payment)..."
								className="w-full rounded-2xl bg-white/10 border border-white/15 pl-12 pr-4 py-4 text-sm text-white placeholder:text-brand-100/50 backdrop-blur-md focus:bg-white focus:text-slate-950 focus:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all duration-200" />
						</div>

						{/* Quick Search Tags */}
						<div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-brand-100/70">
							<span className="font-semibold">Popular:</span>
							{POPULAR_SEARCHES.map((tag) => (
								<button
									key={tag}
									onClick={() => setSearchQuery(tag)}
									className="rounded-lg bg-white/10 px-2.5 py-1 text-brand-100 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
								>
									{tag}
								</button>
							))}
						</div>
					</div>

					{/* Ambient Glow */}
					<div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
				</div>

				{/* --- Quick Order Status Lookup Tool --- */}
				<div className="rounded-hero border border-brand-900/10 bg-white p-6 sm:p-8 shadow-xs">
					<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
						<div className="flex items-start gap-4">
							<div className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-800 shrink-0">
								<PackageIcon className="size-6" />
							</div>
							<div>
								<h2 className="text-xl font-playfair font-normal text-slate-950">
									Quick Order Tracking
								</h2>
								<p className="mt-1 text-xs sm:text-sm text-slate-500">
									Enter your order ID to see current status and shipping
									progress.
								</p>
							</div>
						</div>

						{/* Form */}
						<form
							onSubmit={handleOrderLookup}
							className="flex flex-col sm:flex-row gap-3 min-w-[320px]"
						>
							<Input
								type="text"
								placeholder="Order ID (e.g. #1042)"
								value={orderId}
								onChange={(e) => setOrderId(e.target.value)}
								className="rounded-lg border-slate-200 bg-slate-50 focus:bg-white" />
							<Button
								type="submit"
								className="rounded-lg bg-brand-950 px-6 font-semibold text-white hover:bg-brand-900 shrink-0 cursor-pointer"
							>
								Track
							</Button>
						</form>
					</div>

					{/* Order Status Output */}
					{lookupResult && (
						<div className="mt-6 flex items-start gap-3 rounded-2xl bg-brand-50/70 p-4 border border-brand-900/10 animate-in fade-in duration-200">
							<CheckCircle2Icon className="size-5 text-brand-800 mt-0.5 shrink-0" />
							<p className="text-sm font-semibold text-brand-950">
								{lookupResult}
							</p>
						</div>
					)}
				</div>

				{/* --- Support Category Cards --- */}
				<div className="space-y-4">
					<h2 className="text-2xl font-playfair font-normal text-slate-950">
						Browse by Topic
					</h2>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{SUPPORT_TOPICS.map((topic) => {
							const Icon = topic.icon;
							return (
								<div
									key={topic.id}
									onClick={() => setSelectedCategory(topic.label.split(" ")[0] ?? "")}
									className="group rounded-3xl border border-brand-900/10 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-brand-900/30 cursor-pointer"
								>
									<div className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-800 group-hover:bg-brand-900 group-hover:text-white transition-colors">
										<Icon className="size-6" />
									</div>
									<h3 className="mt-4 text-base font-bold text-slate-950">
										{topic.label}
									</h3>
									<p className="mt-1 text-xs text-slate-500 leading-relaxed">
										{topic.description}
									</p>
									<div className="mt-4 flex items-center text-xs font-bold text-brand-800 group-hover:translate-x-1 transition-transform">
										<span>View articles</span>
										<ChevronRightIcon className="ml-1 size-3.5" />
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* --- Filtered Knowledge Base Articles --- */}
				<div className="rounded-hero border border-brand-900/10 bg-white p-6 sm:p-10 shadow-xs space-y-6">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
						<div>
							<p className="text-xs font-black uppercase tracking-wider text-brand-800">
								Knowledge Base
							</p>
							<h3 className="text-2xl font-playfair font-normal text-slate-950 mt-1">
								{selectedCategory === "All"
									? "All Help Articles"
									: `${selectedCategory} Articles`}
							</h3>
						</div>

						{/* Category Filter Pills */}
						<div className="flex flex-wrap items-center gap-2">
							{["All", "Shipping", "Orders", "Returns", "Products"].map(
								(cat) => (
									<button
										key={cat}
										onClick={() => setSelectedCategory(cat)}
										className={cn(
											"px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer",
											selectedCategory === cat
												? "bg-brand-950 text-white shadow-sm"
												: "bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-900"
										)}
									>
										{cat}
									</button>
								)
							)}
						</div>
					</div>

					{/* Articles Grid */}
					<div className="grid gap-4 md:grid-cols-2">
						{filteredArticles.length === 0 ? (
							<div className="col-span-2 py-12 text-center">
								<HelpCircleIcon className="mx-auto size-10 text-slate-300" />
								<h4 className="mt-3 text-base font-semibold text-slate-900">
									No articles found
								</h4>
								<p className="mt-1 text-xs text-slate-500">
									Try adjusting your search terms or category selection.
								</p>
							</div>
						) : (
							filteredArticles.map((article) => (
								<div
									key={article.id}
									className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/40 p-5 hover:bg-slate-50 hover:border-brand-900/20 transition-all"
								>
									<div>
										<div className="flex items-center justify-between text-xs text-slate-400 mb-2">
											<span className="font-bold text-brand-800 uppercase tracking-wider">
												{article.category}
											</span>
											<span className="flex items-center gap-1">
												<Clock3Icon className="size-3" />
												{article.readTime}
											</span>
										</div>
										<h4 className="text-base font-bold text-slate-950">
											{article.title}
										</h4>
										<p className="mt-2 text-xs leading-relaxed text-slate-600">
											{article.summary}
										</p>
									</div>

									<Link
										to={APP_ROUTES.PAGES.FAQ}
										className="mt-4 inline-flex items-center text-xs font-bold text-brand-900 hover:underline"
									>
										Read full guide
										<ArrowRightIcon className="ml-1 size-3" />
									</Link>
								</div>
							))
						)}
					</div>
				</div>

				{/* --- Still Need Assistance CTA Banner --- */}
				<div className="rounded-hero border border-brand-900/10 bg-linear-to-br from-brand-900 to-slate-900 p-8 sm:p-10 text-white shadow-xl">
					<div className="flex flex-col lg:flex-row items-center justify-between gap-8">
						<div className="space-y-2 text-center lg:text-left">
							<h2 className="text-2xl sm:text-3xl font-playfair font-normal">
								Still haven't found what you need?
							</h2>
							<p className="text-xs sm:text-sm text-brand-100/80 max-w-xl">
								Our support agents are available Monday to Friday to assist you
								with active orders or product questions.
							</p>
						</div>

						<div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
							<Button
								onClick={() => navigate(APP_ROUTES.PAGES.CONTACT)}
								className="w-full sm:w-auto rounded-lg bg-lime-400 px-6 py-3 font-bold text-slate-950 hover:bg-lime-300 cursor-pointer shadow-md"
							>
								<MessageSquareIcon className="mr-2 size-4" />
								Contact Support
							</Button>

							<a
								href="https://wa.me/212611423116"
								target="_blank"
								rel="noreferrer"
								className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20 transition-colors border border-white/15"
							>
								<PhoneIcon className="mr-2 size-4 text-brand-300" />
								WhatsApp Live
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
