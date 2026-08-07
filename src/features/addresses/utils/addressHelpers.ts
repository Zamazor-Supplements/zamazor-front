import type { Address } from "../schemas/addressSchema";

function parseShippingAddressFallback(shippingAddress?: string | null) {
	const empty: Omit<Address, "id"> = {
		street: "",
		city: "",
		phone: "",
		country: "Morocco",
	};

	if (!shippingAddress) {
		return empty;
	}

	const parts = shippingAddress
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean);
	const phonePart = parts.find((part) =>
		part.toLowerCase().startsWith("phone:"),
	);
	const countryPart = parts.find((part) => part.toLowerCase() === "morocco");
	const cleanParts = parts.filter(
		(part) =>
			!part.toLowerCase().startsWith("phone:") &&
			part.toLowerCase() !== "morocco",
	);

	return {
		street: cleanParts[0] || "",
		city: cleanParts[1] || "",
		phone: phonePart ? phonePart.split(":")[1]?.trim() || "" : "",
		country: countryPart || "Morocco",
	};
}

export function buildShippingAddressString(parts: Omit<Address, "id">): string {
	const pieces = [
		parts.street.trim(),
		parts.city.trim(),
		parts.country.trim() || "Morocco",
	];
	const base = pieces.filter(Boolean).join(", ");
	return parts.phone.trim() ? `${base}, Phone: ${parts.phone.trim()}` : base;
}

function toAddressFormValues(
	address: Omit<Address, "id">,
	fallback?: string | null,
): Omit<Address, "id"> {
	const fallbackParts = parseShippingAddressFallback(fallback);

	return {
		street: address?.street || fallbackParts.street,
		city: address?.city || fallbackParts.city,
		phone: address?.phone || fallbackParts.phone,
		country: address?.country || fallbackParts.country,
	};
}

export function toAddressString(
	address: Omit<Address, "id">,
	fallback?: string | null,
): string {
	const parts = toAddressFormValues(address, fallback);
	return buildShippingAddressString(parts);
}
