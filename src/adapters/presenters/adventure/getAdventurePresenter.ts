import type { Adventure } from '@domain/entities';
import type { AdventureDetails } from '@domain/controllers';
import { IGetAdventurePresenter } from '@domain/presenters';
import { summarizeAdventureCharacters } from '@application/shared/adventureCharacterRules';

export class GetAdventurePresenter implements IGetAdventurePresenter {
    present (adventure: Adventure): AdventureDetails {
        const summary = summarizeAdventureCharacters(adventure);

        return {
            id: adventure.id,
            name: adventure.name,
            systemPromptIds: adventure.systemPromptIds,
            playableCharacterIds: summary.playableCharacterIds,
            aiControlledCharacterIds: summary.aiControlledCharacterIds,
            characterAsWorldMasterId: summary.characterAsWorldMasterId,
            worldMasterId: adventure.worldMasterId,
            worldIds: adventure.worldIds,
            locationIds: adventure.locationIds,
            itemIds: adventure.itemIds,
        };
    }
}
