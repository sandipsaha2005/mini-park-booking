import { model } from "@medusajs/framework/utils"

const Park = model.define("park", {
    id: model.id().primaryKey(),
    directus_id: model.text().unique(), 
    name: model.text(),
    description: model.text().nullable(),
    image_url: model.text().nullable(),
    status: model.enum(["published", "draft"]).default("draft"),
})

export default Park