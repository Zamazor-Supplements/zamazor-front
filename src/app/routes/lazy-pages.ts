import { lazy } from "react";

export const LazyOverviewPage = lazy(
	() => import("@/features/dashboard/pages/OverviewPage"),
);
export const LazyProductsPage = lazy(
	() => import("@/features/dashboard/pages/ProductsPage"),
);
export const LazyCategoriesPage = lazy(
	() => import("@/features/dashboard/pages/CategoriesPage"),
);
export const LazyOrdersPage = lazy(
	() => import("@/features/dashboard/pages/OrdersPage"),
);
export const LazyNotFound = lazy(() => import("@/shared/components/NotFound"));
export const LazyHomePage = lazy(
	() => import("@/features/home/pages/HomePage"),
);
export const LazyLoginPage = lazy(
	() => import("@/features/auth/pages/LoginPage"),
);
export const LazyForgotPasswordPage = lazy(
	() => import("@/features/auth/pages/ForgotPasswordPage"),
);
export const LazyResetPasswordPage = lazy(
	() => import("@/features/auth/pages/ResetPasswordPage"),
);
export const LazyVerifyEmailPage = lazy(
	() => import("@/features/auth/pages/VerifyEmailPage"),
);
export const LazyRegisterPage = lazy(
	() => import("@/features/auth/pages/RegisterPage"),
);
export const LazyProductDetailPage = lazy(
	() => import("@/features/products/pages/ProductDetailPage"),
);
export const LazyCartPage = lazy(
	() => import("@/features/cart/pages/CartPage"),
);
export const LazyCheckoutPage = lazy(
	() => import("@/features/orders/pages/CheckoutPage"),
);
export const LazyShopPage = lazy(
	() => import("@/features/products/pages/ShopPage"),
);
export const LazyWishlistPage = lazy(
	() => import("@/features/wishlists/pages/WishlistPage"),
);
export const LazyFAQPage = lazy(
	() => import("@/features/static-pages/pages/FAQPage"),
);
export const LazyProfilePage = lazy(
	() => import("@/features/profile/pages/ProfilePage"),
);
export const LazyUserOrdersPage = lazy(
	() => import("@/features/profile/pages/UserOrdersPage"),
);
export const LazyPaymentSuccessPage = lazy(
	() => import("@/features/orders/pages/PaymentSuccessPage"),
);
export const LazyPaymentCanceledPage = lazy(
	() => import("@/features/orders/pages/PaymentCanceledPage"),
);
export const LazyContactPage = lazy(
	() => import("@/features/static-pages/pages/ContactPage"),
);
export const LazyHelpPage = lazy(
	() => import("@/features/static-pages/pages/HelpPage"),
);
export const LazyShippingPage = lazy(
	() => import("@/features/static-pages/pages/ShippingPage"),
);
export const LazyReturnsPage = lazy(
	() => import("@/features/static-pages/pages/ReturnsPage"),
);
export const LazyTermsPage = lazy(
	() => import("@/features/static-pages/pages/TermsPage"),
);
export const LazyPrivacyPage = lazy(
	() => import("@/features/static-pages/pages/PrivacyPage"),
);
export const LazyAccessibilityPage = lazy(
	() => import("@/features/static-pages/pages/AccessibilityPage"),
);
export const LazyStoryPage = lazy(
	() => import("@/features/static-pages/pages/StoryPage"),
);
