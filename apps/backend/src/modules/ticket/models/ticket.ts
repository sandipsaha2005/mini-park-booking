import { model as m } from '@medusajs/framework/utils'

const Ticket = m.define("ticket", {
  id: m.id().primaryKey(),
  name: m.text(),
  directus_id: m.text().unique(),
  price: m.number(),
  available_quantity: m.number(),
  status: m.enum(["active", "sold_out", "cancelled"]).default("active"),
  park_ids: m.json().default([] as unknown as Record<string, unknown>),
  ticket_type: m.enum(["single", "combo"]).default("single"), 
});

export default Ticket;