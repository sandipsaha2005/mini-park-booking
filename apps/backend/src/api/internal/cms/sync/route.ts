import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { syncParksWorkflow } from '../../../../workflows/sync-parks';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { result } = await syncParksWorkflow(req.scope).run({});

    res.json({
        message: "Sync complete",
        synced: result.total,
        results: result.results,
    })
}

