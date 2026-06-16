import { MedusaService } from "@medusajs/framework/utils";
import Ticket from "./models/ticket";

/*
By extending medusa service you can get 

createTickets(data)
listTickets(filters)
retrieveTicket(id)
updateTickets(selector, data)
deleteTickets(ids)

these function without any code
*/

class TicketModuleService extends MedusaService({
  Ticket,
}) { };

export default TicketModuleService;