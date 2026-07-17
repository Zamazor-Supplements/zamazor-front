// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";
// import { cartService } from "@/features/cart/services/cart.service";
// import { isSystemError } from "../../../shared/types";

// export interface GuestCartItem {
// 	productId: string;
// 	quantity: number;
// }

// interface CartStore {
// 	cart: GuestCartItem[];
// 	isSyncing: boolean;
// 	isHydrated: boolean;
// 	setHydrated: () => void;

// 	getCart: () => Promise<void>;
// 	addItem: (
// 		productId: string,
// 		quantity: number,
// 		isLoggedIn: boolean,
// 	) => Promise<void>;
// 	removeItem: (productId: string, isLoggedIn: boolean) => Promise<void>;
// 	updateQuantity: (
// 		productId: string,
// 		quantity: number,
// 		isLoggedIn: boolean,
// 	) => void;
// 	clearCart: (isLoggedIn: boolean) => Promise<void>;
// }

// export const useCartStore = create<CartStore>()(
// 	persist(
// 		(set, get) => ({
// 			cart: [],
// 			isHydrated: false,
// 			isSyncing: false,
// 			setHydrated: () => set({ isHydrated: true }),

// 			getCart: async () => {
// 				set({ isSyncing: true });

// 				const cart = await cartService.getCart();
// 				if (isSystemError(cart)) {
// 					get().clearCart(false);
// 					return;
// 				}

// 				set({
// 					cart: cart.items.map((item) => ({
// 						productId: item.product.id,
// 						quantity: item.quantity,
// 					})),
// 				});
// 				set({ isSyncing: false });
// 			},

// 			addItem: async (productId, quantity, isLoggedIn) => {
// 				const currentCart = get().cart;

// 				const exists = currentCart.find((i) => i.productId === productId);
// 				const nextCart = exists
// 					? currentCart.map((i) =>
// 							i.productId === productId
// 								? { ...i, quantity: i.quantity + quantity }
// 								: i,
// 						)
// 					: [...currentCart, { productId, quantity }];

// 				set({ cart: nextCart, isSyncing: true });

// 				if (!isLoggedIn) {
// 					set({ isSyncing: false });
// 					return;
// 				}
// 				const response = await cartService.addToCart(productId, quantity);
// 				if (isSystemError(response)) {
// 					set({ cart: currentCart });
// 				}
// 				set({ isSyncing: false });
// 			},
// 			updateQuantity: async (productId, quantity, isLoggedIn) => {
// 				const currentCart = get().cart;

// 				const exists = currentCart.find((i) => i.productId === productId);
// 				if (!exists) return;

// 				const nextCart = currentCart.map((i) =>
// 					i.productId === productId ? { ...i, quantity } : i,
// 				);

// 				set({ cart: nextCart, isSyncing: true });

// 				if (!isLoggedIn) {
// 					set({ isSyncing: false });
// 					return;
// 				}

// 				await cartService.updateCartItemQuantity(productId, quantity);
// 				set({ isSyncing: false });
// 			},

// 			removeItem: async (productId, isLoggedIn) => {
// 				const currentCart = get().cart;
// 				const nextCart = currentCart.filter(
// 					(item) => item.productId !== productId,
// 				);

// 				set({ cart: nextCart, isSyncing: true });

// 				if (!isLoggedIn) return;

// 				await cartService.removeFromCart(productId);

// 				set({ isSyncing: false });
// 			},
// 			clearCart: async (isLoggedIn) => {
// 				const currentCart = get().cart;

// 				set({ cart: [], isSyncing: true });

// 				if (!isLoggedIn) {
// 					set({ isSyncing: false });
// 					return;
// 				}

// 				const response = await cartService.clearCart();
// 				if (isSystemError(response)) {
// 					set({ cart: currentCart });
// 				}

// 				set({ isSyncing: false });
// 			},
// 		}),
// 		{
// 			name: "shopping-cart",
// 			storage: createJSONStorage(() => localStorage),
// 			onRehydrateStorage: () => (state) => {
// 				state?.setHydrated();
// 			},
// 		},
// 	),
// );
