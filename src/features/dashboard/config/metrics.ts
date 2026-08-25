import { formatCurrency } from "@/shared/utils/price";
import {
	AlertTriangle,
	BadgeDollarSign,
	CheckCircle2,
	ClipboardList,
	Clock3,
	Folder,
	Layers,
	Package,
	TrendingUp,
} from "lucide-react";
import type {
	DashboardOverview,
	ProductAnalytics,
} from "../schemas/dashboardSchema";
import type { OrderPage } from "@/features/orders/schemas/orderSchema";

export const OVERVIEW_METRICS_CONFIG = (data: DashboardOverview) => [
	{
		label: "Total Revenue",
		value: formatCurrency(data.totalSales),
		subtitle: "Gross sales across all channels",
		icon: BadgeDollarSign,
		accent: "bg-brand-50 text-brand-800",
		alert: false,
	},
	{
		label: "Total Orders",
		value: String(data.totalOrders),
		subtitle: "Successfully completed transactions",
		icon: ClipboardList,
		accent: "bg-teal-50 text-teal-800",
		alert: false,
	},
	{
		label: "Average Order",
		value: formatCurrency(data.averageOrderValue),
		subtitle: "Mean spend per transaction",
		icon: TrendingUp,
		accent: "bg-lime-50 text-lime-800",
		alert: false,
	},
	{
		label: "Low Stock",
		value: `${data.lowStockProducts.length} items`,
		subtitle: "Inventory items below threshold",
		icon: AlertTriangle,
		accent: "bg-amber-50 text-amber-700",
		alert: true,
	},
];

export const PRODUCT_METRICS_CONFIG = (data: ProductAnalytics) => [
	{
		label: "Total Products",
		value: String(data.totalProducts),
		subtitle: "Active items in catalog",
		accent: "bg-surface-2 text-ink border-brand-900/10",
		icon: Package,
		alert: false,
	},
	{
		label: "Categories",
		value: String(data.totalCategories),
		subtitle: "Active product groups",
		accent: "bg-teal-50 text-teal-700 border-teal-200/60",
		icon: Layers,
		alert: false,
	},
	{
		label: "Low Stock Alert",
		value: String(data.lowStockCount),
		subtitle:
			data.lowStockCount > 0 ? "Requires reordering" : "Stock levels healthy",
		accent:
			data.lowStockCount > 0
				? "bg-amber-50 text-amber-700 border-amber-200/80"
				: "bg-brand-50 text-brand-700 border-brand-200/60",
		icon: AlertTriangle,
		alert: data.lowStockCount > 0,
	},
	{
		label: "Average Price",
		value: formatCurrency(data.averagePrice),
		subtitle: "Mean catalog value",
		accent: "bg-brand-50 text-brand-700 border-brand-200/60",
		icon: BadgeDollarSign,
		alert: false,
	},
];

export const ORDER_METRICS_CONFIG = (orderPage: OrderPage) => {
	const pendingCount = orderPage.items.filter(
		(o) => o.status === "PENDING",
	).length;

	const paidCount = orderPage.items.filter((o) => o.status === "PAID").length;

	const revenue = orderPage.items
		.filter((o) => ["PAID", "COMPLETED", "DELIVERED"].includes(o.status))
		.reduce((sum, o) => sum + (o.total || 0), 0);

	return [
		{
			label: "Total Orders",
			value: String(orderPage.totalElements),
			subtitle: "Across current filter",
			accent: "bg-surface-2 text-ink border-brand-900/10",
			icon: Folder,
			alert: false,
		},
		{
			label: "Pending",
			value: String(pendingCount),
			subtitle: "On current page",
			accent: "bg-amber-50 text-amber-700 border-amber-200/60",
			icon: Clock3,
			alert: true,
		},
		{
			label: "Paid",
			value: String(paidCount),
			subtitle: "On current page",
			accent: "bg-sky-50 text-sky-700 border-sky-200/60",
			icon: CheckCircle2,
			alert: false,
		},
		{
			label: "Page Revenue",
			value: formatCurrency(revenue),
			subtitle: "Settled orders on this page",
			accent: "bg-brand-50 text-brand-800 border-brand-200/60",
			icon: BadgeDollarSign,
			alert: false,
		},
	];
};
