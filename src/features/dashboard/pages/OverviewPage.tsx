import { useMemo } from "react";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import CONFIG from "@/app/config/constants";
import { useDashboardOverview } from "@/features/dashboard/services/queries";
import { HeroBanner } from "@/features/dashboard/components/shared/HeroBanner";
import { OVERVIEW_METRICS_CONFIG } from "@/features/dashboard/config/metrics";
import { Loader2Icon } from "lucide-react";
import { CategoryMix } from "@/features/dashboard/components/overview/CategoryMix";
import { TopProducts } from "@/features/dashboard/components/overview/TopProducts";
import { SalesChart } from "@/features/dashboard/components/overview/SalesChart";
import { RecentOrdersGrid } from "@/features/dashboard/components/overview/RecentOrdersGrid";
import { MetricCard } from "@/features/dashboard/components/shared/MetricCard";
import { OverviewFallbackError } from "@/features/dashboard/components/overview/OverviewFallbackError";
import { OverviewSkeleton } from "@/features/dashboard/components/overview/OverviewSkeleton";
import { LowStockAlerts } from "@/features/dashboard/components/overview/LowStockAlerts";

export const OverviewPage = () => {
	useDocumentTitle(`Dashboard Overview | ${CONFIG.APP_NAME}`);
	const { data, isPending, isError, refetch, isFetching } =
		useDashboardOverview();

	const totalProductsCount = useMemo(() => {
		return (
			data?.categorySummary.reduce((sum, item) => sum + item.count, 0) ?? 0
		);
	}, [data?.categorySummary]);

	if (isPending) {
		return <OverviewSkeleton />;
	}

	if (isError || !data) {
		return <OverviewFallbackError onRefetch={() => refetch()} />;
	}

	const metrics = OVERVIEW_METRICS_CONFIG(data);

	return (
		<div className="relative space-y-6 sm:space-y-8 min-w-0 pb-10">
			{/* Background Refetch Indicator */}
			{isFetching && (
				<div className="absolute -top-3 right-0 z-10 flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm backdrop-blur-xs">
					<Loader2Icon className="size-3 animate-spin text-emerald-800" />
					Updating live data...
				</div>
			)}

			{/* Hero Banner */}
			<HeroBanner data={data} />

			{/* Primary KPI Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
				{metrics.map((metric, index) => (
					<MetricCard key={metric.label} metric={metric} index={index} />
				))}
			</div>

			{/* Main Analytics Section */}
			<div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-6 items-start">
				{/* Added h-full so the card stretches to match the height of the right column on desktop */}
				<div className="h-full">
					<SalesChart
						recentOrders={data.recentOrders}
						pending={data.pendingOrders}
						completed={data.completedOrders}
						canceled={data.canceledOrders}
					/>
				</div>

				<div className="space-y-6 min-w-0">
					<CategoryMix
						categories={data.categorySummary}
						totalProducts={totalProductsCount}
					/>
					<LowStockAlerts products={data.lowStockProducts} />
				</div>
			</div>

			{/* Secondary Data Section */}
			<div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6 items-start">
				<TopProducts products={data.topProducts} />
				<RecentOrdersGrid
					orders={data.recentOrders}
					totalOrders={data.totalOrders}
				/>
			</div>
		</div>
	);
};
