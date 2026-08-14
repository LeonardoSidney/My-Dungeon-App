import { SystemPrompt } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ISystemPromptRepository } from '@domain/repository';
import { IGetSystemPromptsUseCase } from '@domain/use-cases';

export class GetSystemPromptsUseCase implements IGetSystemPromptsUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly systemPromptRepository: ISystemPromptRepository
    ) { }

    async execute (): Promise<SystemPrompt[]> {
        this.logger.info('Executing GetSystemPromptsUseCase::execute');
        return await this.systemPromptRepository.getSystemPrompts();
    }
}
