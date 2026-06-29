import { MedusaRequest, MedusaResponse, AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { createBookingWorkflow } from "../../../workflows/create-booking";
import { CreateBookingSchema } from "./validators";
import { BOOKING_MODULE } from "../../../modules/booking";
import BookingModuleService from "../../../modules/booking/service";
import { TICKET_MODULE } from "../../../modules/ticket";
import TicketModuleService from "../../../modules/ticket/service";
import { PARK_MODULE } from "../../../modules/park";
import ParkModuleService from "../../../modules/park/service";

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
    const customerId = req.auth_context.actor_id;
    const bookingService = req.scope.resolve<BookingModuleService>(BOOKING_MODULE);
    const ticketService = req.scope.resolve<TicketModuleService>(TICKET_MODULE);
    const parkService = req.scope.resolve<ParkModuleService>(PARK_MODULE);

    const bookings = await bookingService.listBookings({ customer_id: customerId });

    const bookingsWithDetails = await Promise.all(
        bookings.map(async (booking) => {
            let parks: any[] = [];
            try {
                const ticket = await ticketService.retrieveTicket(booking.ticket_id);
                const parkIds = (ticket.park_ids as string[]) || [];
                parks = parkIds.length > 0
                    ? await parkService.listParks({ id: parkIds })
                    : [];
            } catch (_) {}
            return { ...booking, parks };
        })
    );

    res.json({ bookings: bookingsWithDetails });
}

export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
    const customerId = req.auth_context.actor_id;
    const customerEmail = req.auth_context.user_metadata?.email as string;

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
        input: { ticket_id, quantity, customer_id: customerId, customer_email: customerEmail },
    })

    res.json({ booking: result })
}
