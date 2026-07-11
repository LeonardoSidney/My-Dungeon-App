import { ILogger } from '@domain/logger';
import { CreateAssistantServiceParams, CreateAssistantServiceResponse, ICreateAssistantService } from '@domain/services';
import { IIdGenerator } from '@domain/providers';

export class CreateAssistantService implements ICreateAssistantService {
    constructor(
        private readonly logger: ILogger,
        private readonly idGenerate: IIdGenerator
    ) { }
    async createAssistant(params: CreateAssistantServiceParams): Promise<CreateAssistantServiceResponse> {
        this.logger.info('Execute CreateAssistantService::createAssistant');
        this.logger.debug('Execute CreateAssistantService::createAssistant - params: ', params);
        const { name, observation, model, sampler } = params;
        const createdAt = new Date();

        return {
            success: true,
            assistant: {
                id: this.idGenerate.generate(),
                name,
                observation,
                model,
                sampler,
                createdAt: createdAt,
                updatedAt: createdAt
            },
        };
    }
}
