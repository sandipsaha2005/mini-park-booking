import { MedusaRequest, MedusaResponse, AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { createBookingWorkflow } from "../../../workflows/create-booking";
import { CreateBookingSchema } from "./validators";

export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {

    const customerId = req.auth_context.actor_id;
    const customerEmail = req.auth_context.user_metadata.email as string;

    console.log(`Booking request from customer: ${customerId}`)


    const parsed = CreateBookingSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            error: "Validation failed",
            issues: parsed.error.issues.map(i => ({
                field: i.path.join("."),
                message: i.message,
            })),
        })
    }

    const { ticket_id, quantity } = parsed.data;

    const { result } = await createBookingWorkflow(req.scope).run({
        input: { ticket_id, quantity, customer_email: customerEmail },
    })

    res.json({ booking: result })
}