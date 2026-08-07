export const addressKeys = {
	all: ["addresses"] as const,
	default: () => [...addressKeys.all, "default"] as const,
};
