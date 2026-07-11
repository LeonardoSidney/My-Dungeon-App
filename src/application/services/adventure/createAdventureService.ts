import { MINIMUM_NUMBER_SYSTEM_PROMPT, MINIMUM_PLAYABLE_CHARACTERS, MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM } from '@domain/constants/adventure';
import { Adventure } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { CreateAdventureServiceParams, CreateAdventureServiceReturn, ICreateAdventureService } from '@domain/services';
import { IIdGenerator } from '@domain/providers';

export class CreateAdventureService implements ICreateAdventureService {
    constructor(
        private readonly logger: ILogger,
        private readonly idGenerate: IIdGenerator
    ) { }
    createAdventure(params: CreateAdventureServiceParams): CreateAdventureServiceReturn {
        this.logger.info('Executing CreateAdventureService', params);
        this.validate(params);
        if (params.worldMaster) {
            this.logger.debug('World Master found. Creating adventure with world master');
            return this.createAdventureWithWoldMaster(params);
        }

        this.logger.debug('No World Master found. Creating adventure without world master');
        return this.createAdventureWithoutWorldMaster(params);
    }

    private validate(params: CreateAdventureServiceParams): void {
        if (params.characters.length < MINIMUM_PLAYABLE_CHARACTERS) {
            throw new Error(`You need at least ${MINIMUM_PLAYABLE_CHARACTERS} to create an adventure`);
        }

        if (params.systemPrompts.length < MINIMUM_NUMBER_SYSTEM_PROMPT) {
            throw new Error('A system prompt is required to create an adventure');
        }
    }

    private createAdventureWithWoldMaster(params: CreateAdventureServiceParams): CreateAdventureServiceReturn {
        const { name, systemPrompts, characters, worldMaster, locations, worlds, items } = params;

        const createdAt = new Date();
        const adventure: Adventure = {
            id: this.idGenerate.generate(),
            name,
            chat: [],
            systemPrompts,
            characters,
            worldMaster,
            locations,
            worlds,
            items,
            createdAt: createdAt,
            updatedAt: createdAt
        };

        return {
            success: true,
            adventure
        };
    }

    private createAdventureWithoutWorldMaster(params: CreateAdventureServiceParams): CreateAdventureServiceReturn {
        const { name, systemPrompts, characters, worldMaster, locations, worlds, items } = params;
        if (characters.length < MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM) {
            return {
                success: false,
                error: `Need at least ${MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM} characters to create an adventure without a world master`
            };

        }

        const hasWorldMasterCharacter = characters.some(c => c.worldMaster === true);
        if (!hasWorldMasterCharacter) {
            return {
                success: false,
                error: 'At least one character must be controlled by the AI when creating an adventure without a world master'
            };
        }

        const createdAt = new Date();
        const adventure: Adventure = {
            id: this.idGenerate.generate(),
            name,
            chat: [],
            systemPrompts,
            characters,
            worldMaster,
            locations,
            worlds,
            items,
            createdAt: createdAt,
            updatedAt: createdAt
        };

        return {
            success: true,
            adventure
        };
    }
}
