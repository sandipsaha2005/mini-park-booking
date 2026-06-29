import {
    createStep,
    createWorkflow,
    StepResponse,
    WorkflowResponse
} from '@medusajs/framework/workflows-sdk';
import { TICKET_MODULE } from '../modules/ticket';
import TicketModuleService from '../modules/ticket/service';
import { BOOKING_MODULE } from '../modules/booking';
import BookingModuleService from '../modules/booking/service';

const validateAndReserveTicketStep = createStep(
    "validate-and-reserve-ticket",
    async (input: { ticket_id: string, quantity: number }, context) => {
        const ticketService = context.container.resolve<TicketModuleService>(TICKET_MODULE);

        const ticket = await ticketService.retrieveTicket(input.ticket_id);
        if (ticket.status !== "active") {
            throw new Error(`Ticket ${input.ticket_id} is not active`)
        }

        if (ticket.available_quantity < input.quantity) {
            throw new Error(`Not enough tickets. Available: ${ticket.available_quantity}`)
        }

        await ticketService.updateTickets({
            id: input.ticket_id,
            available_quantity: ticket.available_quantity - input.quantity
        });

        return new StepResponse(
            { ticket, reserved_quantity: input.quantity },
            { ticket_id: input.ticket_id, previous_quantity: ticket.available_quantity }
        );
    },
    async (compensateInput, context) => {
        const ticketService = context.container.resolve<TicketModuleService>(TICKET_MODULE)
        await ticketService.updateTickets({
            id: compensateInput?.ticket_id,
            available_quantity: compensateInput?.previous_quantity
        });
    }
);

const createBookingRecordStep = createStep(
    "create-booking-record",
    async (input: {
        ticket_id: string
        ticket_name: string
        quantity: number
        customer_id: string
        customer_email: string
        total_price: number
    }, context) => {
        const bookingService = context.container.resolve<BookingModuleService>(BOOKING_MODULE);

        const booking = await bookingService.createBookings({
            ticket_id: input.ticket_id,
            ticket_name: input.ticket_name,
            customer_id: input.customer_id,
            customer_email: input.customer_email,
            quantity: input.quantity,
            total_price: input.total_price * input.quantity,
            status: "confirmed",
        });

        console.log(`✅ Booking created: ${booking.id}`)
        return new StepResponse(booking, { booking_id: booking.id });
    },
    async (compensateInput, context) => {
        const bookingService = context.container.resolve<BookingModuleService>(BOOKING_MODULE);
        if (compensateInput?.booking_id) {
            await bookingService.deleteBookings(compensateInput.booking_id);
        }
    }
);

export const createBookingWorkflow = createWorkflow(
    "create-booking",
    (input: { ticket_id: string; quantity: number; customer_id: string; customer_email: string }) => {
        const { ticket } = validateAndReserveTicketStep(input)

        const booking = createBookingRecordStep({
            ticket_id: input.ticket_id,
            ticket_name: ticket.name,
            quantity: input.quantity,
            customer_id: input.customer_id,
            customer_email: input.customer_email,
            total_price: ticket.price,
        })

        return new WorkflowResponse(booking);
    }
)
