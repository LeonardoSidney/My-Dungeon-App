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
                abilityIds: params.abilityIds,
                proficiencyIds: params.proficiencyIds,
                statusIds: params.statusIds,
                attributes: params.attributes,
                assistantId: params.assistantId,
                createdAt: createdAt,
                updatedAt: createdAt
            }
        };
    }
}
