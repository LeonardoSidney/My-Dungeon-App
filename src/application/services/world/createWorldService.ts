import { ILogger } from '@domain/logger';
import { CreateWorldServiceParams, CreateWorldServiceResponse, ICreateWorldService } from '@domain/services';
import { IIdGenerator } from '@domain/providers';

export class CreateWorldService implements ICreateWorldService {
    constructor(
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) { }

    createWorld(params: CreateWorldServiceParams): CreateWorldServiceResponse {
        this.logger.info('CreateWorldService::createWorld');

        const createdAt = new Date();
        return {
            success: true,
            world: {
                id: this.idGenerator.generate(),
                name: params.name,
                activationWord: params.activationWord,
                prompt: params.prompt,
                observation: params.observation,
                createdAt,
                updatedAt: createdAt
            }
        };
    }
}
