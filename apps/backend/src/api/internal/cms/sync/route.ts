import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { syncParksWorkflow } from '../../../../workflows/sync-parks';
import { syncTicketsWorkflow } from '../../../../workflows/sync-tickets';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const parksResult = await syncParksWorkflow(req.scope).run({})
    const ticketsResult = await syncTicketsWorkflow(req.scope).run({})

    res.json({
        message: "Sync complete",
        parks: {
            synced: parksResult.result.total,
            results: parksResult.result.results,
        },
        tickets: {
            synced: ticketsResult.result.total,
            results: ticketsResult.result.results,
        },
    })
}
