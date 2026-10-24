import type { WorldMaster } from '@domain/entities';
import type { AdventureChatWorldMaster } from '@domain/controllers';
import { IGetAdventureWorldMasterPresenter } from '@domain/presenters';

export class GetAdventureWorldMasterPresenter implements IGetAdventureWorldMasterPresenter {
    present (worldMaster: WorldMaster): AdventureChatWorldMaster {
        return { id: worldMaster.id, name: worldMaster.name };
    }
}
