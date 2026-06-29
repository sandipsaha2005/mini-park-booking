import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { readItems } from "@directus/sdk";
import directusClient from "../clients/directus";
import { TICKET_MODULE } from "../modules/ticket";
import TicketModuleService from "../modules/ticket/service";
import { PARK_MODULE } from "../modules/park";
import ParkModuleService from "../modules/park/service";

const fetchTicketsFromDirectus = createStep(
  "fetch-tickets-from-directus",
  async () => {
    const tickets = await directusClient.request(
      readItems("tickets", {
        filter: { status: { _neq: "cancelled" } },
        fields: [
          "id",
          "name",
          "price",
          "available_quantity",
          "status",
          { park_ids: [{ parks_id: ["id"] }] },
        ] as any,
      }),
    );

    console.log(`📥 Fetched ${tickets.length} tickets from Directus`);
    return new StepResponse({ tickets });
  },
);

const upsertTicketsInMedusaStep = createStep(
  "upsert-tickets-in-medusa",
  async (input: { tickets: any[] }, context) => {
    const ticketService =
      context.container.resolve<TicketModuleService>(TICKET_MODULE);
    const parkService =
      context.container.resolve<ParkModuleService>(PARK_MODULE);

    const results: { action: string; id: string }[] = [];

    for (const ticket of input.tickets) {
      console.log(ticket.park_ids);

      const directusParkIds: string[] = (ticket.park_ids || [])
        .map((rel: any) => rel?.parks_id?.id)
        .filter(Boolean)
        .map(String);

      const medusaParkIds: string[] = [];
      for (const dpid of directusParkIds) {
        const [park] = await parkService.listParks({ directus_id: dpid });
        if (park) medusaParkIds.push(park.id);
      }

      const ticket_type = medusaParkIds.length > 1 ? "combo" : "single";

      const existing = await ticketService.listTickets({
        directus_id: ticket.id.toString(),
      });

      if (existing.length > 0) {
        await ticketService.updateTickets({
          id: existing[0].id,
          name: ticket.name,
          price: ticket.price,
          available_quantity: ticket.available_quantity,
          status: ticket.status,
          park_ids: medusaParkIds,
          ticket_type: ticket_type as "single" | "combo",
        });
        results.push({ action: "updated", id: existing[0].id });
      } else {
        const created = await ticketService.createTickets({
          directus_id: ticket.id.toString(),
          name: ticket.name,
          price: ticket.price,
          available_quantity: ticket.available_quantity,
          status: ticket.status,
          park_ids: medusaParkIds,
          ticket_type: ticket_type as "single" | "combo",
        });
        results.push({ action: "created", id: created.id });
      }
    }

    console.log(`✅ Synced ${results.length} tickets into Medusa`);
    return new StepResponse({ results, total: results.length });
  },
);

export const syncTicketsWorkflow = createWorkflow("sync-tickets", () => {
  const { tickets } = fetchTicketsFromDirectus();
  const result = upsertTicketsInMedusaStep({ tickets });
  return new WorkflowResponse(result);
});
