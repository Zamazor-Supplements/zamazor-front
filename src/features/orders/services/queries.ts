import {
	useQuery,
	useQueryClient,
	type UndefinedInitialDataOptions,
	type UseQueryOptions,
} from "@tanstack/react-query";
import type { OrderPageQueryParams } from "./api";
import type { OrderPage } from "../schemas/orderSchema";
import type { SystemError } from "@/shared/types";
import { orderKeys } from "./keys";
import {
	getAllOrders,
	getOrderById,
	getUserOrders,
	verifyCheckoutPayment,
} from "./api";

export function useOrders<TData = OrderPage>(
	params: OrderPageQueryParams = {},
	options?: Omit<
		UseQueryOptions<OrderPage, SystemError, TData>,
		"queryKey" | "queryFn"
	>,
) {
	return useQuery({
		queryKey: orderKeys.list(params),
		queryFn: () => getAllOrders(params),
		...options,
	});
}

export function useOrder(id: string | undefined) {
	return useQuery({
		queryKey: orderKeys.detail(id!),
		queryFn: () => getOrderById(id!),
		enabled: !!id,
	});
}

export function useMyOrders(
	params: OrderPageQueryParams = {},
	options: Omit<
		UndefinedInitialDataOptions<OrderPage, SystemError, OrderPage>,
		"queryKey" | "queryFn"
	> = {},
) {
	return useQuery({
		queryKey: orderKeys.meList(params),
		queryFn: () => getUserOrders(params),
		...options,
	});
}

export function useVerifyOrderPayment({
	orderId,
}: {
	orderId: string | undefined;
}) {
	const queryClient = useQueryClient();

	return useQuery({
		queryKey: orderKeys.status(orderId!),
		queryFn: async () => {
			const data = await verifyCheckoutPayment(orderId!);
			await queryClient.setQueryData(orderKeys.detail(data.id), data);
			await queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
			return data;
		},
		enabled: !!orderId,
		staleTime: Infinity,
	});
}
