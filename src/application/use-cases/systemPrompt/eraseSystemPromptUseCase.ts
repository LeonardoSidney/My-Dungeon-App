import { ILogger } from '@domain/logger';
import { ISystemPromptRepository } from '@domain/repository';
import { EraseSystemPromptUseCaseReturn, IEraseSystemPromptUseCase } from '@domain/use-cases';

export class EraseSystemPromptUseCase implements IEraseSystemPromptUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly systemPromptRepository: ISystemPromptRepository
    ) { }

    async execute (systemPromptId: string): Promise<EraseSystemPromptUseCaseReturn> {
        this.logger.info('Executing EraseSystemPromptUseCase::execute');
        this.logger.debug('Executing EraseSystemPromptUseCase::execute - systemPromptId: ', systemPromptId);

        const result = await this.systemPromptRepository.eraseSystemPrompt(systemPromptId);

        if (!result.success) {
            this.logger.warning('Failed to erase system prompt', result);
            return {
                success: false,
                error: result.error || 'Failed to erase system prompt'
            };
        }

        this.logger.info('System prompt erased successfully');
        return { success: true };
    }
}
