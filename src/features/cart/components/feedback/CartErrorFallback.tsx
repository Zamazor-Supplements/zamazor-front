import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { ErrorFallback } from "@/shared/components/ui/error-fallback";
import { Link } from "react-router";

export const CartErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
	<ErrorFallback
		title="Error loading cart"
		description="We couldn't fetch your cart summary right now. Please check your network and try again."
		onRetry={onRetry}
		secondaryAction={
			<Button
				asChild
				variant="outline"
				className="rounded-lg border-brand-900/10 px-6 py-2.5 text-brand-900 hover:bg-brand-50"
			>
				<Link to={APP_ROUTES.SHOP}>Return to shop</Link>
			</Button>
		}
	/>
);
