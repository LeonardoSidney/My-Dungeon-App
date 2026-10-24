import type { World } from '@domain/entities';
import type { ActivationPromptListItem } from '@domain/controllers';
import { IGetWorldsPresenter } from '@domain/presenters';

export class GetWorldsPresenter implements IGetWorldsPresenter {
    present (worlds: World[]): ActivationPromptListItem[] {
        return worlds.map(world => ({
            id: world.id,
            name: world.name,
            activationWord: world.activationWord,
        }));
    }
}
