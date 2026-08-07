import { APP_ROUTES } from "@/app/routes/paths";
import { useMutation } from "@tanstack/react-query";
import {
	cancelOrder,
	changeOrderStatus,
	checkout,
	getCheckoutPaymentUrl,
} from "./api";
import { useNavigate } from "react-router";
import { orderKeys } from "./keys";
import { useQueryClient } from "@tanstack/react-query";
import type { CheckoutFormValues } from "../schemas/checkoutSchema";
import { cartKeys } from "@/features/cart/services/keys";
import type { OrderStatus } from "../constants/orderStatus";

export function useCheckout() {
	const queryClient = useQueryClient();
	const { mutate: getPaymentUrl } = useGetPaymentUrl();

	return useMutation({
		mutationFn: (payload: CheckoutFormValues) => checkout(payload),
		onSuccess: async (newOrder) => {
			queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

			queryClient.setQueryData(orderKeys.detail(newOrder.id), newOrder);

			// On checkout, the cart is converted to order
			queryClient.removeQueries({
				queryKey: cartKeys.all,
			});

			getPaymentUrl(newOrder.id);
		},
	});
}

export function useChangeOrderStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
			changeOrderStatus(orderId, status),
		onSuccess: (updatedOrder) => {
			queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
			queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);
		},
	});
}

export function useCancelOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderId: string) => cancelOrder(orderId),
		onSuccess: (updatedOrder) => {
			queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
			queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);
		},
	});
}

/**
 * Initiate payment and redirect user to Stripe/payment gateway.
 */
export function useGetPaymentUrl() {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (orderId: string) => getCheckoutPaymentUrl(orderId),
		onSuccess: (data) => {
			if (data.paymentUrl) {
				window.location.href = data.paymentUrl;
			}
		},
		onError: () => {
			navigate(APP_ROUTES.SHOP);
		},
	});
}
