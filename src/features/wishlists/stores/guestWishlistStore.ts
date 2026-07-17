import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { WishlistService } from "../types/service";

export type GuestWishlist = string[];
interface GuestWishlistStore extends WishlistService {
	items: GuestWishlist;
	isHydrated: boolean;
	setHydrated: () => void;
}

export const useGuestWishlistStore = create<GuestWishlistStore>()(
	persist(
		(set, get) => ({
			items: [] satisfies string[],
			isHydrated: false,
			setHydrated: () => set({ isHydrated: true }),

			getItems: async () => get().items,

			toggleItem: async (productId) => {
				const current = get().items;
				const next = current.includes(productId)
					? current.filter((id) => id !== productId)
					: [...current, productId];
				set({ items: next });
				console.log(next);

				return next;
			},

			clear: async () => void set({ items: [] }),
		}),
		{
			name: "wishlist",
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => (state) => {
				state?.setHydrated();
			},
		},
	),
);

export const useIsWishlistItem = (productId: string) => {
	return useGuestWishlistStore((state) => state.items.includes(productId));
};
