import { ILogger } from '@domain/logger';
import { CreateAbilityServiceParams, CreateAbilityServiceReturn, ICreateAbilityService, IIdGenerator } from '@domain/services';

export class CreateAbilityService implements ICreateAbilityService {
    constructor(
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) { }
    createAbility(params: CreateAbilityServiceParams): CreateAbilityServiceReturn {
        this.logger.info('Executing CreateAbilityService::createAbility');

        const createdAt = new Date();
        return {
            success: true,
            ability: {
                id: this.idGenerator.generate(),
                name: params.name,
                activationWorld: params.activationWorld,
                prompt: params.prompt,
                observation: params.observation,
                createdAt: createdAt,
                updatedAt: createdAt
            }
        };
    }
}
