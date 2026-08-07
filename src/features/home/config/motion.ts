export const backgroundVariants = {
	initial: { opacity: 0, scale: 1.05 },
	animate: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 1.05 },
} as const;

export const contentContainerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.06, delayChildren: 0.12 },
	},
	exit: {
		opacity: 0,
		transition: { duration: 0.12, ease: "easeOut" },
	},
} as const;

export const childVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.25, ease: "easeOut" },
	},
	exit: { opacity: 0, y: -15, transition: { duration: 0.12 } },
} as const;
