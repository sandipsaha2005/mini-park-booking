import { model as m } from '@medusajs/framework/utils'

const Ticket = m.define("ticket", {
  id: m.id().primaryKey(),
  name: m.text(),
  price: m.number(),
  available_quantity: m.number(),
  visit_date: m.dateTime(),
  status: m.enum(["active", "sold_out", "cancelled"]).default("active"),
});

export default Ticket;