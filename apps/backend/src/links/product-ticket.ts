import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import TicketModule from "../modules/ticket";

export default defineLink(
  ProductModule.linkable.productVariant,
  TicketModule.linkable.ticket
);
