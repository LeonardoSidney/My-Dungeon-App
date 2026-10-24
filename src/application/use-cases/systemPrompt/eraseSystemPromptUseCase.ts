import { ILogger } from '@domain/logger';
import { ISystemPromptRepository } from '@domain/repository';
import { EraseSystemPromptUseCaseReturn, IEraseSystemPromptUseCase, EraseSystemPromptUseCaseParams } from '@domain/use-cases';

export class EraseSystemPromptUseCase implements IEraseSystemPromptUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly systemPromptRepository: ISystemPromptRepository
    ) { }

    async execute (params: EraseSystemPromptUseCaseParams): Promise<EraseSystemPromptUseCaseReturn> {
        this.logger.info('Executing EraseSystemPromptUseCase::execute');
        this.logger.debug('Executing EraseSystemPromptUseCase::execute - params.id: ', params.id);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const result = await this.systemPromptRepository.eraseSystemPrompt(params.id);

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

    private validate (params: EraseSystemPromptUseCaseParams): string | null {
        if (!params.id) {
            return 'A system prompt id is required to erase a system prompt';
        }

        return null;
    }
}
