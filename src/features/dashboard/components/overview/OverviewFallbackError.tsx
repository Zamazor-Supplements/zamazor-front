import { ErrorFallback } from "@/shared/components/ui/error-fallback";

export const OverviewFallbackError = ({
	onRefetch,
}: {
	onRefetch: () => void;
}) => (
	<ErrorFallback
		title="Failed to Sync Analytics"
		description="We couldn't retrieve the dashboard overview data right now. Please check your network or try again."
		onRetry={onRefetch}
		className="rounded-3xl border border-brand-900/10 bg-card min-h-0"
	/>
);
