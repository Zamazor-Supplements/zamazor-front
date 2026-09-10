import { useScrollToTop } from "@/shared/hooks/use-scroll-to-top";
import { Outlet } from "react-router";

export const RootLayout = () => {
	useScrollToTop();
	return <Outlet />;
};
