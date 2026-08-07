/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Outlet } from "react-router";

import { APP_ROUTES } from "./paths";
import { RequireAuth } from "@/features/auth/components/shared/RequireAuth";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { OverviewPage } from "@/features/dashboard/pages/OverviewPage";
import { ProductsPage } from "@/features/dashboard/pages/ProductsPage";
import { CategoriesPage } from "@/features/dashboard/pages/CategoriesPage";
import { OrdersPage } from "@/features/dashboard/pages/OrdersPage";
import NotFound from "@/shared/components/NotFound";
import { HomePage } from "@/features/home/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ProductDetailPage } from "@/features/products/pages/ProductDetailPage";
import { CartPage } from "@/features/cart/pages/CartPage";
import { CheckoutPage } from "@/features/orders/pages/CheckoutPage";
import { ShopPage } from "@/features/products/pages/ShopPage";
import { WishlistPage } from "@/features/wishlists/pages/WishlistPage";
import { FAQPage } from "@/features/static-pages/pages/FAQPage";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { useScrollToTop } from "@/shared/hooks/use-scroll-to-top";
import { MainLayout } from "@/app/layouts/MainLayout";
import { PaymentSuccessPage } from "@/features/orders/pages/PaymentSuccessPage";
import { PaymentCanceledPage } from "@/features/orders/pages/PaymentCanceledPage";
import { ContactPage } from "@/features/static-pages/pages/ContactPage";
import { HelpPage } from "@/features/static-pages/pages/HelpPage";
import { ShippingPage } from "@/features/static-pages/pages/ShippingPage";
import { ReturnsPage } from "@/features/static-pages/pages/ReturnsPage";
import { TermsPage } from "@/features/static-pages/pages/TermsPage";
import { PrivacyPage } from "@/features/static-pages/pages/PrivacyPage";
import { AccessibilityPage } from "@/features/static-pages/pages/AccessibilityPage";
import { StoryPage } from "@/features/static-pages/pages/StoryPage";

const RootLayout = () => {
	useScrollToTop();
	return <Outlet />;
};

const router = createBrowserRouter([
	{
		element: <RootLayout />,
		children: [
			{
				element: <MainLayout />,
				children: [
					{ path: APP_ROUTES.HOME, element: <HomePage /> },
					{ path: APP_ROUTES.SHOP, element: <ShopPage /> },
					{ path: APP_ROUTES.PRODUCT(":id"), element: <ProductDetailPage /> },
					{ path: APP_ROUTES.CART, element: <CartPage /> },
					{ path: APP_ROUTES.USER.WISHLIST, element: <WishlistPage /> },

					{ path: APP_ROUTES.PAGES.CONTACT, element: <ContactPage /> },
					{ path: APP_ROUTES.PAGES.FAQ, element: <FAQPage /> },
					{ path: APP_ROUTES.PAGES.ABOUT, element: <StoryPage /> },
					{ path: APP_ROUTES.PAGES.HELP, element: <HelpPage /> },
					{ path: APP_ROUTES.PAGES.RETURNS, element: <ReturnsPage /> },
					{ path: APP_ROUTES.PAGES.SHIPPING, element: <ShippingPage /> },

					{
						path: APP_ROUTES.PAGES.ACCESSIBILITY,
						element: <AccessibilityPage />,
					},
					{ path: APP_ROUTES.PAGES.TERMS, element: <TermsPage /> },
					{ path: APP_ROUTES.PAGES.PRIVACY, element: <PrivacyPage /> },

					{
						element: <RequireAuth />,
						children: [
							{ path: APP_ROUTES.USER.PROFILE, element: <ProfilePage /> },
						],
					},
				],
			},

			{ path: APP_ROUTES.AUTH.LOGIN, element: <LoginPage /> },
			{ path: APP_ROUTES.AUTH.REGISTER, element: <RegisterPage /> },

			{
				element: <RequireAuth />,
				children: [
					{ path: APP_ROUTES.CHECKOUT.ROOT, element: <CheckoutPage /> },
					{
						path: APP_ROUTES.CHECKOUT.SUCCESS(":orderId"),
						element: <PaymentSuccessPage />,
					},
					{
						path: APP_ROUTES.CHECKOUT.CANCEL(":orderId"),
						element: <PaymentCanceledPage />,
					},
				],
			},

			{
				element: <RequireAuth allowedRoles={["ADMIN"]} />,
				children: [
					{
						path: APP_ROUTES.DASHBOARD.ROOT,
						element: <DashboardLayout />,
						children: [
							{ index: true, element: <OverviewPage /> },
							{ path: "products", element: <ProductsPage /> },
							{ path: "categories", element: <CategoriesPage /> },
							{ path: "orders", element: <OrdersPage /> },
						],
					},
				],
			},

			{ path: APP_ROUTES.NOT_FOUND, element: <NotFound /> },
		],
	},
]);

export default router;
