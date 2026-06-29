import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { buildInternalOpenApiDocument } from "./openapi"

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  res.json(buildInternalOpenApiDocument())
}
