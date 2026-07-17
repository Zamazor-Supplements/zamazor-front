import { orderStatusSchema } from "@/features/orders/schemas/orderSchema";
import z from "zod/v4";

export const recentOrderSchema = z.object({
	id: z.uuid(),
	status: orderStatusSchema,
	subtotal: z.number().positive(),
	shippingCost: z.number().nonnegative(),
	discount: z.number().nonnegative(),
	tax: z.number().nonnegative(),
	total: z.number().positive(),
	shippingCountry: z.string(),
	shippingCity: z.string(),
	shippingStreet: z.string(),
	phone: z.string(),
	createdAt: z.iso.datetime().pipe(z.coerce.date()),
});
export type RecentOrder = z.infer<typeof recentOrderSchema>;

export const lowStockProductSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	stockQuantity: z.int().nonnegative(),
	category: z.string(),
});

export const categorySummarySchema = z.object({
	category: z.string(),
	count: z.int().nonnegative(),
});

export const topProductSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	quantity: z.int().nonnegative(),
	revenue: z.number().nonnegative(),
	category: z.string(),
});

export const dashboardOverviewSchema = z.object({
	totalSales: z.number().nonnegative(),
	averageOrderValue: z.number().nonnegative(),
	totalOrders: z.int().nonnegative(),
	pendingOrders: z.int().nonnegative(),
	completedOrders: z.int().nonnegative(),
	canceledOrders: z.int().nonnegative(),
	inFlightOrders: z.int().nonnegative(),
	recentOrders: z.array(recentOrderSchema),
	lowStockProducts: z.array(lowStockProductSchema),
	categorySummary: z.array(categorySummarySchema),
	topProducts: z.array(topProductSchema),
});

export type DashboardOverview = z.infer<typeof dashboardOverviewSchema>;

export const categoryAnalyticsSchema = z.array(
	z.object({
		id: z.uuid(),
		label: z.string(),
		productCount: z.int().nonnegative(),
	}),
);

export type CategoryAnalytics = z.infer<typeof categoryAnalyticsSchema>;

export const productAnalyticsSchema = z.object({
	totalProducts: z.int().nonnegative(),
	totalCategories: z.int().nonnegative(),
	lowStockCount: z.int().nonnegative(),
	averagePrice: z.number().positive(),
});

export type ProductAnalytics = z.infer<typeof productAnalyticsSchema>;
