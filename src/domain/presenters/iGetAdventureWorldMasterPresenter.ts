import type { WorldMaster } from '../entities';
import type { AdventureChatWorldMaster } from '../controllers';

export interface IGetAdventureWorldMasterPresenter {
    present (worldMaster: WorldMaster): AdventureChatWorldMaster;
}
