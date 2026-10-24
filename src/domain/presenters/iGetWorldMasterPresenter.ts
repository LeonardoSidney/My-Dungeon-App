import type { WorldMaster } from '../entities';
import type { WorldMasterDetails } from '../controllers';

export interface IGetWorldMasterPresenter {
    present (worldMaster: WorldMaster): WorldMasterDetails;
}
