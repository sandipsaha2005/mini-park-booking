import { model as m } from '@medusajs/framework/utils'

const Booking = m.define("booking", {
  id: m.id().primaryKey(),
  ticket_id: m.text(),
  ticket_name: m.text(),
  customer_id: m.text(),
  customer_email: m.text(),
  quantity: m.number(),
  total_price: m.number(),
  status: m.enum(["pending", "confirmed", "cancelled"]).default("pending"),
})

export default Booking
