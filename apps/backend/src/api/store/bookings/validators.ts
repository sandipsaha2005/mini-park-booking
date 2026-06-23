import { z } from "zod";

export const CreateBookingSchema = z.object({
    ticket_id: z.string().nonempty({ message: "Ticket id can't be empty" }),
    quantity: z.number().int().positive("quantity must be at least 1").max(10, "max 10 tickets per booking"),
    customer_email: z.string().email("must be a valid email")
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;