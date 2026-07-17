export const cartKeys = {
	all: ["cart"] as const,
	details: (isLoggedIn: boolean) =>
		[...cartKeys.all, "detail", isLoggedIn] as const,
	summaries: () => [...cartKeys.all, "summary"] as const,
	summary: (isLoggedIn: boolean, guestItemsHash?: string) =>
		[
			...cartKeys.summaries(),
			isLoggedIn ? "authenticated" : "guest",
			...(guestItemsHash ? [guestItemsHash] : []),
		] as const,
};
