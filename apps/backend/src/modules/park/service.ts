import { MedusaService } from '@medusajs/framework/utils';
import Park from './models/park';

class ParkModuleService extends MedusaService({ Park }) { };

export default ParkModuleService;