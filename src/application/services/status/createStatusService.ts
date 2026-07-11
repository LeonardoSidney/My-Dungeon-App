import { ILogger } from '@domain/logger';
import { CreateStatusServiceParams, CreateStatusServiceReturn, ICreateStatusService } from '@domain/services';
import { IIdGenerator } from '@domain/providers';

export class CreateStatusService implements ICreateStatusService {
    constructor(
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) { }

    createStatus(params: CreateStatusServiceParams): CreateStatusServiceReturn {
        this.logger.info('Executing CreateStatusService::createStatus');

        const createdAt = new Date();
        return {
            success: true,
            status: {
                id: this.idGenerator.generate(),
                name: params.name,
                activationWord: params.activationWord,
                prompt: params.prompt,
                observation: params.observation,
                createdAt: createdAt,
                updatedAt: createdAt
            }
        };
    }
}
