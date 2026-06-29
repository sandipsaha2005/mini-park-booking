import {
    createWorkflow,
    createStep,
    StepResponse,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { readItems } from "@directus/sdk"
import directusClient from "../clients/directus"
import { PARK_MODULE } from "../modules/park"
import ParkModuleService from "../modules/park/service"

const fetchDataFromDirectus = createStep(
    "fetch-parks-from-directus",
    async () => {
        const parks = await directusClient.request(
            readItems("parks", {
                filter: { status: { _eq: "published" } },
                fields: ["id", "name", "description", "image_url", "status"]
            })
        )

        console.log(`📥 Fetched ${parks.length} parks from Directus`)
        return new StepResponse({ parks })
    }
)

const upsertParksInMedusaStep = createStep(
    "upsert-parks-in-medusa",
    async (input: { parks: any[] }, context) => {
        const parkService = context.container.resolve<ParkModuleService>(PARK_MODULE);

        const results: { action: string; id: string }[] = [];
        for (const park of input.parks) {

            const existing = await parkService.listParks({
                directus_id: park.id.toString(),
            })

            if (existing.length > 0) {
                await parkService.updateParks({
                    id: existing[0].id,
                    name: park.name,
                    description: park.description,
                    image_url: park.image_url,
                    status: park.status
                })

                results.push({ action: "updated", id: existing[0].id })

            } else {

                console.log({ park });

                const created = await parkService.createParks({
                    directus_id: park.id.toString(),
                    name: park.name,
                    description: park.description,
                    image_url: park.image_url,
                    status: park.status,
                });

                results.push({ action: "created", id: created.id })

            }
        }
        console.log(`✅ Synced ${results.length} parks into Medusa`)
        return new StepResponse({ results, total: results.length })
    }
)

export const syncParksWorkflow = createWorkflow(
    "sync-parks",
    () => {
        const { parks } = fetchDataFromDirectus();
        const result = upsertParksInMedusaStep({ parks });
        return new WorkflowResponse(result);
    }
)

// http://host.docker.internal:9000/internal/cms/sync callback url to sync parks from directus to medusa