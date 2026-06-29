import { MedusaRequest, MedusaResponse, AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { BOOKING_MODULE } from "../../../../modules/booking";
import BookingModuleService from "../../../../modules/booking/service";
import { TICKET_MODULE } from "../../../../modules/ticket";
import TicketModuleService from "../../../../modules/ticket/service";
import { PARK_MODULE } from "../../../../modules/park";
import ParkModuleService from "../../../../modules/park/service";

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
    const customerId = req.auth_context.actor_id;
    const bookingService = req.scope.resolve<BookingModuleService>(BOOKING_MODULE);
    const ticketService = req.scope.resolve<TicketModuleService>(TICKET_MODULE);
    const parkService = req.scope.resolve<ParkModuleService>(PARK_MODULE);

    const booking = await bookingService.retrieveBooking(req.params.id);

    if (booking.customer_id !== customerId) {
        return res.status(403).json({ error: "Forbidden" });
    }

    let parks: any[] = [];
    try {
        const ticket = await ticketService.retrieveTicket(booking.ticket_id);
        const parkIds = (ticket.park_ids as string[]) || [];
        parks = parkIds.length > 0
            ? await parkService.listParks({ id: parkIds })
            : [];
    } catch (_) {}

    res.json({ booking: { ...booking, parks } });
}
