import { ILogger } from '@domain/logger';
import { CreateWorldMasterServiceParams, CreateWorldMasterServiceResponse, ICreateWorldMasterService, IIdGenerator } from '@domain/services';

export class CreateWorldMasterService implements ICreateWorldMasterService {
    constructor(
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) { }
    createWorldMaster(params: CreateWorldMasterServiceParams): CreateWorldMasterServiceResponse {
        this.logger.info('CreateWorldMasterService::createWorldMaster');

        const createdAt = new Date();
        return {
            success: true,
            worldMaster: {
                id: this.idGenerator.generate(),
                name: params.name,
                activationWord: params.activationWord,
                prompt: params.prompt,
                observation: params.observation,
                assistant: params.assistant,
                createdAt: createdAt,
                updatedAt: createdAt
            }
        };
    }
}
