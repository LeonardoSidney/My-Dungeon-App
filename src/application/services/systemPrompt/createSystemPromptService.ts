import { ILogger } from '@domain/logger';
import { CreateSystemPromptServiceParams, CreateSystemPromptServiceResponse, ICreateSystemPromptService } from '@domain/services';
import { IIdGenerator } from '@domain/providers';

export class CreateSystemPromptService implements ICreateSystemPromptService {
    constructor (
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) { }

    createSystemPrompt (params: CreateSystemPromptServiceParams): CreateSystemPromptServiceResponse {
        this.logger.info('CreateSystemPromptService::createSystemPrompt');

        const createdAt = new Date();
        return {
            success: true,
            systemPrompt: {
                id: this.idGenerator.generate(),
                name: params.name,
                content: params.content,
                observation: params.observation,
                createdAt,
                updatedAt: createdAt
            }
        };
    }
}
