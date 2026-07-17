import z from "zod/v4";

export const paymentSessionResponseSchema = z.object({
	paymentUrl: z.url(),
	sessionId: z.string(),
	expiresAt: z.iso.datetime().pipe(z.coerce.date()),
});
export type PaymentSessionResponse = z.infer<
	typeof paymentSessionResponseSchema
>;
