import { ILogger } from '@domain/logger';
import { CreateItemServiceParams, CreateItemServiceResponse, ICreateItemService, IIdGenerator } from '@domain/services';

export class CreateItemService implements ICreateItemService {
    constructor(
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) { }

    createItem(params: CreateItemServiceParams): CreateItemServiceResponse {
        this.logger.info('CreateItemService::createItem');

        const createdAt = new Date();
        return {
            success: true,
            item: {
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
