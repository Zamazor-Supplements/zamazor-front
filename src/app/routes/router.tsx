import { Suspense, type ComponentType } from "react";
import { createBrowserRouter } from "react-router";

import { APP_ROUTES } from "./paths";
import { RequireAuth } from "@/features/auth/components/shared/RequireAuth";
import { RouteFallback } from "./RouterFallback";
import * as lazyPages from "./lazy-pages";
import { DashboardLayout, MainLayout, RootLayout } from "../layouts";

function withSuspense(
	Component: ComponentType,
	options = { fullScreen: false },
) {
	return (
		<Suspense fallback={<RouteFallback {...options} />}>
			<Component />
		</Suspense>
	);
}

const router = createBrowserRouter([
	{
		element: <RootLayout />,
		children: [
			{
				element: <MainLayout />,
				children: [
					{
						path: APP_ROUTES.HOME,
						element: withSuspense(lazyPages.LazyHomePage),
					},
					{
						path: APP_ROUTES.SHOP,
						element: withSuspense(lazyPages.LazyShopPage),
					},
					{
						path: APP_ROUTES.PRODUCT(),
						element: withSuspense(lazyPages.LazyProductDetailPage),
					},
					{
						path: APP_ROUTES.CART,
						element: withSuspense(lazyPages.LazyCartPage),
					},
					{
						path: APP_ROUTES.USER.WISHLIST,
						element: withSuspense(lazyPages.LazyWishlistPage),
					},

					{
						path: APP_ROUTES.PAGES.CONTACT,
						element: withSuspense(lazyPages.LazyContactPage),
					},
					{
						path: APP_ROUTES.PAGES.FAQ,
						element: withSuspense(lazyPages.LazyFAQPage),
					},
					{
						path: APP_ROUTES.PAGES.ABOUT,
						element: withSuspense(lazyPages.LazyStoryPage),
					},
					{
						path: APP_ROUTES.PAGES.HELP,
						element: withSuspense(lazyPages.LazyHelpPage),
					},
					{
						path: APP_ROUTES.PAGES.RETURNS,
						element: withSuspense(lazyPages.LazyReturnsPage),
					},
					{
						path: APP_ROUTES.PAGES.SHIPPING,
						element: withSuspense(lazyPages.LazyShippingPage),
					},

					{
						path: APP_ROUTES.PAGES.ACCESSIBILITY,
						element: withSuspense(lazyPages.LazyAccessibilityPage),
					},
					{
						path: APP_ROUTES.PAGES.TERMS,
						element: withSuspense(lazyPages.LazyTermsPage),
					},
					{
						path: APP_ROUTES.PAGES.PRIVACY,
						element: withSuspense(lazyPages.LazyPrivacyPage),
					},

					{
						element: <RequireAuth />,
						children: [
							{
								path: APP_ROUTES.USER.PROFILE,
								element: withSuspense(lazyPages.LazyProfilePage),
							},
						],
					},
				],
			},

			{
				path: APP_ROUTES.AUTH.LOGIN,
				element: withSuspense(lazyPages.LazyLoginPage, { fullScreen: true }),
			},
			{
				path: APP_ROUTES.AUTH.REGISTER,
				element: withSuspense(lazyPages.LazyRegisterPage, { fullScreen: true }),
			},

			{
				element: <RequireAuth />,
				children: [
					{
						path: APP_ROUTES.CHECKOUT.ROOT,
						element: withSuspense(lazyPages.LazyCheckoutPage, {
							fullScreen: true,
						}),
					},
					{
						path: APP_ROUTES.CHECKOUT.SUCCESS(),
						element: withSuspense(lazyPages.LazyPaymentSuccessPage, {
							fullScreen: true,
						}),
					},
					{
						path: APP_ROUTES.CHECKOUT.CANCEL(),
						element: withSuspense(lazyPages.LazyPaymentCanceledPage, {
							fullScreen: true,
						}),
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
							{
								index: true,
								element: withSuspense(lazyPages.LazyOverviewPage, {
									fullScreen: true,
								}),
							},
							{
								path: "products",
								element: withSuspense(lazyPages.LazyProductsPage, {
									fullScreen: true,
								}),
							},
							{
								path: "categories",
								element: withSuspense(lazyPages.LazyCategoriesPage, {
									fullScreen: true,
								}),
							},
							{
								path: "orders",
								element: withSuspense(lazyPages.LazyOrdersPage, {
									fullScreen: true,
								}),
							},
						],
					},
				],
			},

			{
				path: APP_ROUTES.NOT_FOUND,
				element: withSuspense(lazyPages.LazyNotFound, { fullScreen: true }),
			},
		],
	},
]);

export default router;
