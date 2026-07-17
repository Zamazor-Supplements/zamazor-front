// import type { Product } from "@/features/products/schemas/productSchema";
// import { productService } from "@/features/products/services/productService";
// import { wishlistService } from "@/features/products/services/wishlistService";
// import { isSystemError } from "@/shared/types";
// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";

// interface WishlistStore {
// 	wishlist: string[]; // contains wishlist products ids
// 	isSyncing: boolean;
// 	isHydrated: boolean;
// 	setHydrated: () => void;
// 	setWishlist: (ids: string[]) => void;

// 	getWishlist: (isLoggedIn: boolean) => Promise<Product[]>;
// 	toggleToWishlist: (product: Product, isLoggedIn: boolean) => Promise<void>;
// 	clearWishlist: (isLoggedIn: boolean) => Promise<void>;
// }

// export const useWishlistStore = create<WishlistStore>()(
// 	persist(
// 		(set, get) => ({
// 			wishlist: [],
// 			isHydrated: false,
// 			isSyncing: false,
// 			setHydrated: () => set({ isHydrated: true }),
// 			setWishlist: (productIds) => set({ wishlist: productIds }),

// 			getWishlist: async (isLoggedIn) => {
// 				set({ isSyncing: true });

// 				if (isLoggedIn) {
// 					const response = await wishlistService.getWishlist();
// 					if (isSystemError(response)) {
// 						set({ isSyncing: false });
// 						return [] satisfies Product[];
// 					}

// 					const products = response.map((w) => w.product);
// 					set({ wishlist: products.map((p) => p.id) });
// 					return products;
// 				}

// 				const response = await productService.bulkProducts(get().wishlist);
// 				if (isSystemError(response)) {
// 					set({ isSyncing: false });
// 					return [] satisfies Product[];
// 				}

// 				const products = response;
// 				set({ wishlist: products.map((p) => p.id) });
// 				set({ isSyncing: false });
// 				return products;
// 			},
// 			toggleToWishlist: async (product, isLoggedIn) => {
// 				const currentWishlist = get().wishlist;
// 				const exists = currentWishlist.find((id) => id === product.id);

// 				const nextWishlist = exists
// 					? currentWishlist.filter((id) => id !== product.id)
// 					: [...currentWishlist, product.id];
// 				set({ wishlist: nextWishlist, isSyncing: true });

// 				if (!isLoggedIn) {
// 					set({ isSyncing: false });
// 					return;
// 				}

// 				const response = await wishlistService.toggleToWishlist(product.id);
// 				if (isSystemError(response)) {
// 					set({ wishlist: currentWishlist });
// 				}
// 				set({ isSyncing: false });
// 			},
// 			clearWishlist: async (isLoggedIn) => {
// 				const currentWishlist = get().wishlist;

// 				set({ wishlist: [], isSyncing: true });

// 				if (!isLoggedIn) {
// 					set({ isSyncing: false });
// 					return;
// 				}

// 				const response = await wishlistService.clearWishlist();
// 				if (isSystemError(response)) {
// 					set({ wishlist: currentWishlist });
// 				}

// 				set({ isSyncing: false });
// 			},
// 		}),
// 		{
// 			name: "wishlist",
// 			storage: createJSONStorage(() => localStorage),
// 			onRehydrateStorage: () => (state) => {
// 				state?.setHydrated();
// 			},
// 		},
// 	),
// );

// export const useIsWishlistItem = (productId: string) => {
// 	return useWishlistStore((state) => state.wishlist.includes(productId));
// };
