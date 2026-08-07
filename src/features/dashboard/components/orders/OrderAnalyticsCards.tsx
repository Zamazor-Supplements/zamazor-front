import { ORDER_METRICS_CONFIG } from "../../config/metrics";
import type { OrderPage } from "@/features/orders/schemas/orderSchema";
import { MetricCard } from "../shared/MetricCard";

interface OrderAnalyticsCardsProps {
	orderPage: OrderPage;
}

export const OrderAnalyticsCards = ({
	orderPage,
}: OrderAnalyticsCardsProps) => {
	const metrics = ORDER_METRICS_CONFIG(orderPage);

	return (
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			{metrics.map((metric, index) => (
				<MetricCard key={metric.label} metric={metric} index={index} />
			))}
		</div>
	);
};
