import { ILogger } from '@domain/logger';
import { IAssistantRepository } from '@domain/repository';
import { EraseAssistantUseCaseReturn, IEraseAssistantUseCase, EraseAssistantUseCaseParams } from '@domain/use-cases';

export class EraseAssistantUseCase implements IEraseAssistantUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly assistantRepository: IAssistantRepository
    ) { }

    async execute (params: EraseAssistantUseCaseParams): Promise<EraseAssistantUseCaseReturn> {
        this.logger.info('Executing EraseAssistantUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const result = await this.assistantRepository.eraseAssistant(params.id);
        if (!result.success) {
            return { success: false, error: result.error || 'Failed to erase assistant' };
        }
        return { success: true };
    }

    private validate (params: EraseAssistantUseCaseParams): string | null {
        if (!params.id) {
            return 'An assistant id is required to erase an assistant';
        }

        return null;
    }
}
