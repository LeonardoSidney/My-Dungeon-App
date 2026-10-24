import type { WorldMaster } from '@domain/entities';
import type { ActivationPromptListItem } from '@domain/controllers';
import { IGetWorldMastersPresenter } from '@domain/presenters';

export class GetWorldMastersPresenter implements IGetWorldMastersPresenter {
    present (worldMasters: WorldMaster[]): ActivationPromptListItem[] {
        return worldMasters.map(worldMaster => ({
            id: worldMaster.id,
            name: worldMaster.name,
            activationWord: worldMaster.activationWord,
        }));
    }
}
