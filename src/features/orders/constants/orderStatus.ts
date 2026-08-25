import z from "zod/v4";

export const OrderStatus = {
	Pending: "PENDING",
	Paid: "PAID",
	Confirmed: "CONFIRMED",
	Processing: "PROCESSING",
	Shipped: "SHIPPED",
	Delivered: "DELIVERED",
	Canceled: "CANCELED",
	Refunded: "REFUNDED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export type OrderStatusFilter = OrderStatus | undefined;

export const orderStatusSchema = z.enum([
	OrderStatus.Pending,
	OrderStatus.Paid,
	OrderStatus.Confirmed,
	OrderStatus.Processing,
	OrderStatus.Shipped,
	OrderStatus.Delivered,
	OrderStatus.Canceled,
	OrderStatus.Refunded,
]);

type Meta = {
	label: string;
	badgeClass: string;
	accentClass: string;
};

export const ORDER_STATUS_META: Record<OrderStatus, Meta> = {
	PENDING: {
		label: "Pending",
		badgeClass: "border-amber-200/70 bg-amber-50 text-amber-800",
		accentClass: "bg-amber-50 text-amber-800",
	},
	CONFIRMED: {
		label: "Confirmed",
		badgeClass: "border-sky-200/70 bg-sky-50 text-sky-800",
		accentClass: "bg-sky-50 text-sky-800",
	},
	PROCESSING: {
		label: "Processing",
		badgeClass: "border-violet-200/70 bg-violet-50 text-violet-800",
		accentClass: "bg-violet-50 text-violet-800",
	},
	SHIPPED: {
		label: "Shipped",
		badgeClass: "border-cyan-200/70 bg-cyan-50 text-cyan-800",
		accentClass: "bg-cyan-50 text-cyan-800",
	},
	DELIVERED: {
		label: "Delivered",
		badgeClass: "border-lime-200/70 bg-lime-50 text-lime-800",
		accentClass: "bg-lime-50 text-lime-800",
	},
	PAID: {
		label: "Paid",
		badgeClass: "border-brand-200/70 bg-brand-50 text-brand-800",
		accentClass: "bg-brand-50 text-brand-800",
	},
	CANCELED: {
		label: "Canceled",
		badgeClass: "border-slate-200 bg-slate-100 text-slate-500",
		accentClass: "bg-slate-100 text-slate-500",
	},
	REFUNDED: {
		label: "Refunded",
		badgeClass: "border-rose-200/70 bg-rose-50 text-rose-800",
		accentClass: "bg-rose-50 text-rose-800",
	},
} as const;

const FinalOrderStatus = new Set<OrderStatus>([
	OrderStatus.Delivered,
	OrderStatus.Canceled,
	OrderStatus.Refunded,
]);
type FinalOrderStatus =
	typeof FinalOrderStatus extends Set<infer T> ? T : never;

export function isFinalOrderStatus(
	status: OrderStatus,
): status is FinalOrderStatus {
	return FinalOrderStatus.has(status);
}
