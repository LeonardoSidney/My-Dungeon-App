import { ILogger } from '@domain/logger';
import { CreateLocationServiceParams, CreateLocationServiceResponse, ICreateLocationService } from '@domain/services';
import { IIdGenerator } from '@domain/providers';

export class CreateLocationService implements ICreateLocationService {
    constructor (
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) { }

    createLocation (params: CreateLocationServiceParams): CreateLocationServiceResponse {
        this.logger.info('CreateLocationService::createLocation');

        const createdAt = new Date();
        return {
            success: true,
            location: {
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
