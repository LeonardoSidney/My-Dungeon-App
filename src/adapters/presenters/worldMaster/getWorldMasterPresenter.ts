import type { WorldMaster } from '@domain/entities';
import type { WorldMasterDetails } from '@domain/controllers';
import { IGetWorldMasterPresenter } from '@domain/presenters';

export class GetWorldMasterPresenter implements IGetWorldMasterPresenter {
    present (worldMaster: WorldMaster): WorldMasterDetails {
        return {
            id: worldMaster.id,
            name: worldMaster.name,
            activationWord: worldMaster.activationWord,
            prompt: worldMaster.prompt,
            observation: worldMaster.observation,
            assistantId: worldMaster.assistantId,
        };
    }
}
