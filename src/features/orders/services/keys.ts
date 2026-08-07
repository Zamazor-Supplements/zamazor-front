import type { OrderPageQueryParams } from "./api";

export const orderKeys = {
	all: ["orders"] as const,
	lists: () => [...orderKeys.all, "list"] as const,
	list: (params: OrderPageQueryParams) =>
		[...orderKeys.lists(), params] as const,
	details: () => [...orderKeys.all, "detail"] as const,
	detail: (id: string) => [...orderKeys.details(), id] as const,
	statuses: () => [...orderKeys.all, "status"] as const,
	status: (id: string) => [...orderKeys.statuses(), id] as const,
	me: () => [...orderKeys.all, "me"] as const,
	meList: (params: OrderPageQueryParams) =>
		[...orderKeys.me(), "list", params] as const,
};
