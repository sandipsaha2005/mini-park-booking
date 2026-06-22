import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createBookingWorkflow } from "../../workflows/create-booking";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { ticket_id, quantity, customer_email } = req.body as {
        ticket_id: string
        quantity: number
        customer_email: string
    };

    const { result } = await createBookingWorkflow(req.scope).run({
        input: { ticket_id, quantity, customer_email },
    })

    res.json({ booking: result })
}