import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import ParkModuleService from "../../../modules/park/service";
import { PARK_MODULE } from "../../../modules/park";


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const parkService = req.scope.resolve<ParkModuleService>(PARK_MODULE);
    const parks = await parkService.listParks();

    res.json({ parks })
}