import { MetricCard, type Metric } from "./MetricCard";

interface AnalyticsCardsProps {
	metrics: readonly Metric[];
}

export const AnalyticsCards = ({ metrics }: AnalyticsCardsProps) => (
	<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
		{metrics.map((metric, index) => (
			<MetricCard key={metric.label} metric={metric} index={index} />
		))}
	</div>
);
