import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { TICKET_MODULE } from "../../../../modules/ticket"
import TicketModuleService from "../../../../modules/ticket/service"
import { PARK_MODULE } from "../../../../modules/park"
import ParkModuleService from "../../../../modules/park/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const ticketService = req.scope.resolve<TicketModuleService>(TICKET_MODULE)
    const parkService = req.scope.resolve<ParkModuleService>(PARK_MODULE)

    const ticket = await ticketService.retrieveTicket(req.params.id)

    const parkIds = (ticket.park_ids as string[]) || []
    const parks = parkIds.length > 0
        ? await parkService.listParks({ id: parkIds })
        : []

    res.json({ ticket: { ...ticket, parks } })
}
