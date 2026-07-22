import { ILogger } from '@domain/logger';
import { CreateCharacterServiceParams, CreateCharacterServiceResponse, ICreateCharacterService } from '@domain/services';
import { IIdGenerator } from '@domain/providers';

export class CreateCharacterService implements ICreateCharacterService {
    constructor (
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) { }
    createCharacter (params: CreateCharacterServiceParams): CreateCharacterServiceResponse {
        this.logger.info('CreateCharacterService::createCharacter');

        const createdAt = new Date();
        return {
            success: true,
            character: {
                id: this.idGenerator.generate(),
                name: params.name,
                activationWord: params.activationWord,
                prompt: params.prompt,
                observation: params.observation,
                abilities: params.abilities,
                proficiencies: params.proficiencies,
                statuses: params.statuses,
                attributes: params.attributes,
                assistant: params.assistant,
                worldMaster: params.worldMaster,
                createdAt: createdAt,
                updatedAt: createdAt
            }
        };
    }
}
