import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: tickets } = await query.graph({
    entity: "ticket",
    filters: { id: req.params.id },
    fields: [
      "id",
      "name",
      "price",
      "available_quantity",
      "visit_date",
      "status",
      "product_variant.*",
    ],
  });

  res.json({ ticket: tickets[0] })
};