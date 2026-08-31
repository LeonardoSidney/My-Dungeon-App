import { ILogger } from '@domain/logger';
import { ISystemPromptRepository } from '@domain/repository';
import { ICreateSystemPromptService } from '@domain/services';
import { CreateSystemPromptUseCaseParams, CreateSystemPromptUseCaseResponse, ICreateSystemPromptUseCase } from '@domain/use-cases';

export class CreateSystemPromptUseCase implements ICreateSystemPromptUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly systemPromptRepository: ISystemPromptRepository,
        private readonly service: ICreateSystemPromptService
    ) { }

    async execute (params: CreateSystemPromptUseCaseParams): Promise<CreateSystemPromptUseCaseResponse> {
        this.logger.info('Executing CreateSystemPromptUseCase::execute');
        this.logger.debug('CreateSystemPromptUseCase::execute - params:', params);

        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }

        const response = this.service.createSystemPrompt(params);
        this.logger.debug('CreateSystemPromptService executed successfully', response);

        if (!response.success) {
            return {
                success: response.success,
                error: response.error
            };
        }

        if (!response.systemPrompt) {
            return {
                success: false,
                error: 'Something went wrong when tried to create the system prompt'
            };
        }

        const systemPrompts = await this.systemPromptRepository.getSystemPrompts();
        this.logger.debug('SystemPromptRepository executed successfully', systemPrompts);
        const alreadyExists = systemPrompts.find((prompt) => prompt.name === response.systemPrompt?.name);

        if (alreadyExists) {
            this.logger.warning(`System prompt with name ${response.systemPrompt.name} already exists`);
            return {
                success: false,
                error: `System prompt with name ${response.systemPrompt.name} already exists`
            };
        }

        await this.systemPromptRepository.saveSystemPrompt({ systemPrompt: response.systemPrompt });

        return {
            success: true,
            systemPrompt: response.systemPrompt
        };
    }

    private validate (params: CreateSystemPromptUseCaseParams): string | null {
        if (!params.name?.trim()) {
            return 'Name is required to create a system prompt';
        }

        if (!params.content?.trim()) {
            return 'Content is required to create a system prompt';
        }

        return null;
    }
}
