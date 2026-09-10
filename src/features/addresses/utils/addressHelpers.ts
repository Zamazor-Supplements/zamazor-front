import type { Address } from "../schemas/addressSchema";
import { APP_COUNTRY } from "@/app/config/constants";

// Cached lower-case form used for the case-insensitive comparisons below.
// Kept at module scope so we don't re-allocate on every parse.
const APP_COUNTRY_LC = APP_COUNTRY.toLowerCase();

function parseShippingAddressFallback(shippingAddress?: string | null) {
	const empty: Omit<Address, "id"> = {
		street: "",
		city: "",
		phone: "",
		country: APP_COUNTRY,
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
	const countryPart = parts.find(
		(part) => part.toLowerCase() === APP_COUNTRY_LC,
	);
	const cleanParts = parts.filter(
		(part) =>
			!part.toLowerCase().startsWith("phone:") &&
			part.toLowerCase() !== APP_COUNTRY_LC,
	);

	return {
		street: cleanParts[0] || "",
		city: cleanParts[1] || "",
		phone: phonePart ? phonePart.split(":")[1]?.trim() || "" : "",
		country: countryPart || APP_COUNTRY,
	};
}

export function buildShippingAddressString(parts: Omit<Address, "id">): string {
	const pieces = [
		parts.street.trim(),
		parts.city.trim(),
		parts.country.trim() || APP_COUNTRY,
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
