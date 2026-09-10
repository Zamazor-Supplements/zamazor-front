import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartService } from "../types/service";

export interface GuestStoreCartItem {
	productId: string;
	quantity: number;
}

interface GuestCartStore extends CartService {
	items: GuestStoreCartItem[];
	isHydrated: boolean;
	setHydrated: () => void;
}

export const useGuestCartStore = create<GuestCartStore>()(
	persist(
		(set, get) => ({
			items: [],
			isHydrated: false,
			setHydrated: () => set({ isHydrated: true }),

			getItems: async () => get().items,

			addItem: async (productId, quantity = 1) => {
				const currentItems = get().items;

				const existing = currentItems.find((i) => i.productId === productId);
				const nextItems = existing
					? currentItems.map((i) =>
							i.productId === productId
								? { ...i, quantity: i.quantity + quantity }
								: i,
						)
					: [...currentItems, { productId, quantity }];

				set({ items: nextItems });
				return nextItems;
			},

			updateQuantity: async (productId, quantity) => {
				const currentItems = get().items;

				const exists = currentItems.find((i) => i.productId === productId);
				if (!exists) return currentItems;

				// quantity > 0 -> update quantity
				// quantity <= 0 -> remove item
				const nextItems =
					quantity > 0
						? currentItems.map((i) =>
								i.productId === productId ? { ...i, quantity } : i,
							)
						: currentItems.filter((i) => i.productId !== productId);

				set({ items: nextItems });
				return nextItems;
			},

			removeItem: async (productId) => {
				const currentItems = get().items;
				const nextItems = currentItems.filter(
					(item) => item.productId !== productId,
				);

				set({ items: nextItems });
				return nextItems;
			},

			clear: async () => void set({ items: [] }),
		}),
		{
			name: "shopping-cart",
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => (state) => {
				state?.setHydrated();
			},
		},
	),
);
