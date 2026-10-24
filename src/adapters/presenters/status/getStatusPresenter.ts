import type { Status } from '@domain/entities';
import type { ActivationPromptDetails } from '@domain/controllers';
import { IGetStatusPresenter } from '@domain/presenters';

export class GetStatusPresenter implements IGetStatusPresenter {
    present (status: Status): ActivationPromptDetails {
        return {
            id: status.id,
            name: status.name,
            activationWord: status.activationWord,
            prompt: status.prompt,
            observation: status.observation,
        };
    }
}
