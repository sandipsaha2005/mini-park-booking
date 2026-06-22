import {
    createStep,
    createWorkflow,
    StepResponse,
    WorkflowResponse
} from '@medusajs/framework/workflows-sdk';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { TICKET_MODULE } from '../modules/ticket';
import TicketModuleService from '../modules/ticket/service';

const sqsClient = new SQSClient({
    region: process.env.AWS_REGION || "us-east-1",
    endpoint: process.env.AWS_ENDPOINT || "http://localhost:4566",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
    },
})

const publishToQueueStep = createStep(
    "publish-to-queue",
    async (input: { booking_id: string; ticket_id: string; customer_email: string }) => {
        await sqsClient.send(
            new SendMessageCommand({
                QueueUrl: process.env.SQS_QUEUE_URL,
                MessageBody: JSON.stringify({
                    booking_id: input.booking_id,
                    ticket_id: input.ticket_id,
                    customer_email: input.customer_email,
                    event: "booking.created",
                }),
            })
        )

        console.log(`📨 Message pushed to SQS for booking ${input.booking_id}`)
        return new StepResponse({ queued: true })
    }
)

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

        await ticketService.updateTickets(
            {
                id: input.ticket_id,
                available_quantity: ticket.available_quantity - input.quantity
            }
        );

        return new StepResponse(
            { ticket, reserved_quantity: input.quantity },
            { ticket_id: input.ticket_id, previous_quantity: ticket.available_quantity }
        );
    },

    async (compensateInput, context) => {
        const ticketService = context.container.resolve<TicketModuleService>(TICKET_MODULE)

        await ticketService.updateTickets(
            {
                id: compensateInput?.ticket_id,
                available_quantity: compensateInput?.previous_quantity
            }
        );

    }
);

const createBookingRecordStep = createStep(
    "create-booking-record",
    async (input: {
        ticket_id: string
        quantity: number
        customer_email: string
        ticket_name: string
        total_price: number
    }, context) => {

        const booking = {
            id: `booking_${Date.now()}`,
            ticket_id: input.ticket_id,
            ticket_name: input.ticket_name,
            quantity: input.quantity,
            customer_email: input.customer_email,
            total_price: input.total_price * input.quantity,
            status: "pending",
            created_at: new Date().toISOString(),
        }

        return new StepResponse(booking, { booking_id: booking.id })
    },

    async (compensateInput) => {
        console.log(`Compensating: would delete booking ${compensateInput?.booking_id}`)

    }
)

export const createBookingWorkflow = createWorkflow(
    "create-booking",
    (input: { ticket_id: string; quantity: number; customer_email: string }) => {
        const { ticket, reserved_quantity } = validateAndReserveTicketStep(input)

        const booking = createBookingRecordStep({
            ticket_id: input.ticket_id,
            quantity: input.quantity,
            customer_email: input.customer_email,
            ticket_name: ticket.name,
            total_price: ticket.price,
        })

        publishToQueueStep({
            booking_id: booking.id,
            ticket_id: input.ticket_id,
            customer_email: input.customer_email,
        })

        return new WorkflowResponse(booking);
    }
)