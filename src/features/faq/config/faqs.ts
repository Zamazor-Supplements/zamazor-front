import CONFIG from "@/app/config/constants";
import type { FAQ_CATEGORIES } from "./categories";

interface FAQItem {
	id: string;
	category: Exclude<(typeof FAQ_CATEGORIES)[number], "All">;
	question: string;
	answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
	{
		id: "choose-product",
		category: "Products",
		question: "How do I know which product to choose?",
		answer:
			"Start with your main goal: energy, recovery, focus, or daily nutrition. Product cards and categories guide you toward the most suitable formula.",
	},
	{
		id: "change-order",
		category: "Orders",
		question: "Can I change my order after payment?",
		answer:
			"Changes depend on the order status. The sooner you contact us, the easier it is to adjust an address or delivery detail.",
	},
	{
		id: "shipping-time",
		category: "Shipping",
		question: "How long does shipping take?",
		answer:
			"Most orders arrive within 3 to 5 business days across Morocco. Timing can vary by destination and order volume.",
	},
	{
		id: "everyday-use",
		category: "Products",
		question: "Are the formulas suitable for everyday use?",
		answer:
			"Yes, the products are designed to fit easily into a regular routine with clear ingredients and simple usage.",
	},
	{
		id: "returns",
		category: "Returns",
		question: "How do returns work?",
		answer:
			"Contact support first. We review the order details and guide you toward the best solution.",
	},
	{
		id: "bulk-orders",
		category: "Orders",
		question: "Can I place a bulk order?",
		answer:
			"Yes. The Contact page and Bulk Orders section are set up for gyms, clubs, and larger purchases.",
	},
	{
		id: "checkout-security",
		category: "Orders",
		question: "Is checkout secure?",
		answer:
			"Yes. Checkout uses 256-bit SSL encryption, and payment details are processed cleanly through verified payment gateways.",
	},
	{
		id: "contact-support",
		category: "Orders",
		question: "Who should I contact if something goes wrong?",
		answer: `Email ${CONFIG.SUPPORT_EMAIL} or use the contact form; we reply within 24 hours with the details needed to move quickly.`,
	},
];
