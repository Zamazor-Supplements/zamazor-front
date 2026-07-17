import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	orderService,
	type CheckoutRequest,
	type OrderPageQueryParams,
} from "../services/orderService";
import type {
	UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import type { OrderPage } from "../schemas/orderSchema";

// Query Keys factory for consistency
export const orderKeys = {
	all: ["orders"] as const,
	lists: () => [...orderKeys.all, "list"] as const,
	myLists: (params: OrderPageQueryParams) =>
		[...orderKeys.lists(), "me", params] as const,
	allLists: (params: OrderPageQueryParams) =>
		[...orderKeys.lists(), "all", params] as const,
	details: () => [...orderKeys.all, "detail"] as const,
	detail: (id: string) => [...orderKeys.details(), id] as const,
};

export const userOrdersOptions = (params: OrderPageQueryParams = {}) =>
	queryOptions({
		queryKey: orderKeys.myLists(params),
		queryFn: () => orderService.getUserOrders(params),
		placeholderData: (previousData) => previousData,
	});

export function useUserOrders(
	params: OrderPageQueryParams = {},
	options: Omit<
		UndefinedInitialDataOptions<OrderPage, Error, OrderPage>,
		"queryKey" | "queryFn"
	> = {},
) {
	return useQuery({
		queryKey: orderKeys.myLists(params),
		queryFn: () => orderService.getUserOrders(params),
		// Keeps previous page's data on screen while fetching the next page
		placeholderData: (previousData) => previousData,
		...options,
	});
}

// Hook to get all the orders (paginated/filtered)
export function useAllOrders(params: OrderPageQueryParams = {}) {
	return useQuery({
		queryKey: orderKeys.allLists(params),
		queryFn: () => orderService.getAllOrders(params),
		placeholderData: (previousData) => previousData,
	});
}

// Hook to get a single order by ID
export function useOrderDetails(id: string) {
	return useQuery({
		queryKey: orderKeys.detail(id),
		queryFn: () => orderService.getOrderById(id),
		enabled: !!id, // Only run if an ID is actually provided
	});
}

// Hook to handle checkout
export function useCheckout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CheckoutRequest) => orderService.checkout(payload),
		onSuccess: (newOrder) => {
			// Invalidate order lists so the new order shows up immediately
			queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

			// Seed the cache for the individual order details right away
			queryClient.setQueryData(orderKeys.detail(newOrder.id), newOrder);
		},
	});
}

// Hook to change an order's status (Admin feature)
export function useChangeOrderStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
			orderService.changeOrderStatus(orderId, status),
		onSuccess: (updatedOrder) => {
			// Refetch lists to show updated statuses
			queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

			// Update the specific order in the cache directly
			queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);
		},
	});
}

// Hook to cancel an order
export function useCancelOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderId: string) => orderService.cancelOrder(orderId),
		onSuccess: (updatedOrder) => {
			queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
			queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);
		},
	});
}

/**
 * Hook 1: Initiate payment and redirect user to Stripe/payment gateway.
 */
export function useGetPaymentUrl() {
	return useMutation({
		mutationFn: (orderId: string) =>
			orderService.getCheckoutPaymentUrl(orderId),
		onSuccess: (data) => {
			if (data.paymentUrl) {
				window.location.href = data.paymentUrl;
			}
		},
	});
}

/**
 * Hook 2: Verify the payment outcome once back on your app.
 */
export function useVerifyPayment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			orderId,
			sessionId,
		}: {
			orderId: string;
			sessionId: string;
		}) => orderService.verifyCheckoutPayment(orderId, sessionId),
		onSuccess: (updatedOrder) => {
			// 1. Immediately cache the updated order details (now marked as PAID or FAILED)
			queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);

			// 2. Invalidate order lists to ensure status updates everywhere
			queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
		},
	});
}
