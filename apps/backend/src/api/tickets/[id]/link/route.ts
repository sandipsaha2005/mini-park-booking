import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { Modules } from "@medusajs/framework/utils"
import { TICKET_MODULE } from "../../../../modules/ticket"


export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { variant_id } = req.body as { variant_id: string }
  const ticket_id = req.params.id;

  const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK);

  await remoteLink.create({
    [Modules.PRODUCT]: {
        product_variant_id: variant_id
    },
    [TICKET_MODULE]: {
        ticket_id
    }
  });

  res.json({ message: "Linked successfully", ticketId: ticket_id, variant_id });
}