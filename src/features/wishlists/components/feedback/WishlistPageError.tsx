import { ErrorFallback } from "@/shared/components/ui/error-fallback";

export function WishlistPageError({ onRefetch }: { onRefetch: () => void }) {
	return (
		<ErrorFallback
			title="Failed to load wishlist"
			description="Something went wrong while fetching your favorites."
			onRetry={onRefetch}
		/>
	);
}
