import { LoadingScreen } from "@/features/auth/components/shared/LoadingScreen";

export function RouteFallback({ fullScreen }: { fullScreen: boolean }) {
	return (
		<LoadingScreen
			fullScreen={fullScreen}
			message="Loading page..."
			subtext="Just a moment while we fetch your data"
		/>
	);
}
