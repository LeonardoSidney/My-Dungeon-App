import { ILogger } from '@domain/logger';
import { ISystemPromptRepository } from '@domain/repository';
import { GetSystemPromptsUseCaseReturn, IGetSystemPromptsUseCase } from '@domain/use-cases';

export class GetSystemPromptsUseCase implements IGetSystemPromptsUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly systemPromptRepository: ISystemPromptRepository
    ) { }

    async execute (): Promise<GetSystemPromptsUseCaseReturn> {
        this.logger.info('Executing GetSystemPromptsUseCase::execute');

        const response = await this.systemPromptRepository.getSystemPrompts();
        if (!response.success || !response.systemPrompts) {
            this.logger.warning('GetSystemPromptsUseCase::execute - failed to load system prompts', response.error);
            return { success: false, error: response.error };
        }

        return { success: true, systemPrompts: response.systemPrompts };
    }
}
