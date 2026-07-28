import { MINIMUM_NUMBER_SYSTEM_PROMPT, MINIMUM_PLAYABLE_CHARACTERS, MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM } from '@domain/constants/adventure';
import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { EditAdventureServiceParams, EditAdventureServiceReturn, IEditAdventureService } from '@domain/services';

export class EditAdventureService implements IEditAdventureService {
    constructor (
        private readonly logger: ILogger
    ) { }

    editAdventure (params: EditAdventureServiceParams): EditAdventureServiceReturn {
        this.logger.info('Executing EditAdventureService::editAdventure');
        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        if (params.worldMaster) {
            this.logger.debug('World Master found. Editing adventure with world master');
            return this.editAdventureWithWorldMaster(params);
        }

        this.logger.debug('No World Master found. Editing adventure without world master');
        return this.editAdventureWithoutWorldMaster(params);
    }

    private validate (params: EditAdventureServiceParams): string | null {
        if (params.characters.length < MINIMUM_PLAYABLE_CHARACTERS) {
            return `You need at least ${MINIMUM_PLAYABLE_CHARACTERS} to edit an adventure`;
        }

        if (params.systemPrompts.length < MINIMUM_NUMBER_SYSTEM_PROMPT) {
            return 'A system prompt is required to edit an adventure';
        }

        return null;
    }

    private editAdventureWithWorldMaster (params: EditAdventureServiceParams): EditAdventureServiceReturn {
        const { id, name, systemPrompts, characters, worldMaster, locations, worlds, items, chat, createdAt } = params;

        const adventure: Adventure = {
            id,
            name,
            chat,
            systemPrompts,
            characters,
            worldMaster,
            locations,
            worlds,
            items,
            createdAt,
            updatedAt: new Date()
        };

        return {
            success: true,
            adventure
        };
    }

    private editAdventureWithoutWorldMaster (params: EditAdventureServiceParams): EditAdventureServiceReturn {
        const { id, name, systemPrompts, characters, worldMaster, locations, worlds, items, chat, createdAt } = params;
        if (characters.length < MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM) {
            return {
                success: false,
                error: `Need at least ${MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM} characters to edit an adventure without a world master`
            };
        }

        const hasWorldMasterCharacter = characters.some(c => c.worldMaster === true);
        if (!hasWorldMasterCharacter) {
            return {
                success: false,
                error: 'At least one character must be controlled by the AI when editing an adventure without a world master'
            };
        }

        const adventure: Adventure = {
            id,
            name,
            chat,
            systemPrompts,
            characters,
            worldMaster,
            locations,
            worlds,
            items,
            createdAt,
            updatedAt: new Date()
        };

        return {
            success: true,
            adventure
        };
    }
}
