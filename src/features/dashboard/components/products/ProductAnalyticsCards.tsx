import type { ProductAnalytics } from "@/features/dashboard/schemas/dashboardSchema";
import { PRODUCT_METRICS_CONFIG } from "../../config/metrics";
import { MetricCard } from "../shared/MetricCard";

interface ProductAnalyticsCardsProps {
	analytics: ProductAnalytics;
}

export const ProductAnalyticsCards = ({
	analytics,
}: ProductAnalyticsCardsProps) => {
	const metrics = PRODUCT_METRICS_CONFIG(analytics);

	return (
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{metrics.map((metric, index) => (
				<MetricCard key={metric.label} metric={metric} index={index} />
			))}
		</div>
	);
};
