import { ILogger } from '@domain/logger';
import { ISystemPromptRepository } from '@domain/repository';
import {
    GetSystemPromptByIdUseCaseParams,
    GetSystemPromptByIdUseCaseReturn,
    IGetSystemPromptByIdUseCase,
} from '@domain/use-cases';

export class GetSystemPromptByIdUseCase implements IGetSystemPromptByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly systemPromptRepository: ISystemPromptRepository
    ) { }

    async execute (params: GetSystemPromptByIdUseCaseParams): Promise<GetSystemPromptByIdUseCaseReturn> {
        this.logger.info('Executing GetSystemPromptByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const systemPromptResponse = await this.systemPromptRepository.getSystemPromptById(params.id);
        if (!systemPromptResponse.success) {
            this.logger.warning('GetSystemPromptByIdUseCase::execute - failed to load system prompt', systemPromptResponse.error);
            return { success: false, error: systemPromptResponse.error };
        }

        const systemPrompt = systemPromptResponse.systemPrompt;
        if (!systemPrompt) {
            return { success: false, error: `System prompt with id ${params.id} not found` };
        }

        return { success: true, systemPrompt };
    }

    private validate (params: GetSystemPromptByIdUseCaseParams): string | null {
        if (!params.id?.trim()) {
            return 'System prompt id is required';
        }

        return null;
    }
}
