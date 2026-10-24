import type { World } from '@domain/entities';
import type { ActivationPromptDetails } from '@domain/controllers';
import { IGetWorldPresenter } from '@domain/presenters';

export class GetWorldPresenter implements IGetWorldPresenter {
    present (world: World): ActivationPromptDetails {
        return {
            id: world.id,
            name: world.name,
            activationWord: world.activationWord,
            prompt: world.prompt,
            observation: world.observation,
        };
    }
}
