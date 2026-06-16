import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { TICKET_MODULE } from "../../modules/ticket";
import TicketModuleService from "../../modules/ticket/service";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const ticketService = req.scope.resolve<TicketModuleService>(TICKET_MODULE);
  const tickets = await ticketService.listTickets();

  res.json({ tickets });
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const ticketService = req.scope.resolve<TicketModuleService>(TICKET_MODULE);
  const ticket = await ticketService.createTickets(req.body as any);

  res.json({ ticket });
}