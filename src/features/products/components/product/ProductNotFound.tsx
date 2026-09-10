import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { PackageXIcon } from "lucide-react";
import { Link } from "react-router";

export const ProductNotFound = () => (
	<div className="flex min-h-[70vh] items-center justify-center p-4">
		<EmptyState
			icon={PackageXIcon}
			title="Product not found"
			description="We couldn't find the supplement formulation you were looking for. It may have been moved or removed."
			className="max-w-md"
			action={
				<Button
					asChild
					className="rounded-lg bg-brand-900 px-6 py-2.5 text-white transition-colors hover:bg-brand-950"
				>
					<Link to={APP_ROUTES.HOME}>Return to home</Link>
				</Button>
			}
		/>
	</div>
);
