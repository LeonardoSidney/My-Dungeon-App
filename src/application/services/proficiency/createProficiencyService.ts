import { ILogger } from '@domain/logger';
import { CreateProficiencyServiceParams, CreateProficiencyServiceReturn, ICreateProficiencyService, IIdGenerator } from '@domain/services';

export class CreateProficiencyService implements ICreateProficiencyService {
    constructor(
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) { }
    createProficiency(params: CreateProficiencyServiceParams): CreateProficiencyServiceReturn {
        this.logger.info('Executing CreateProficiencyService::createProficiency');

        const createdAt = new Date();
        return {
            success: true,
            proficiency: {
                id: this.idGenerator.generate(),
                name: params.name,
                prompt: params.prompt,
                activationWord: params.activationWord,
                observation: params.observation,
                createdAt: createdAt,
                updatedAt: createdAt
            }
        };
    }
}
