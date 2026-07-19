import { ILogger } from '@domain/logger';
import { IAssistantRepository } from '@domain/repository';
import { EraseAssistantUseCaseReturn, IEraseAssistantUseCase } from '@domain/use-cases';

export class EraseAssistantUseCase implements IEraseAssistantUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly assistantRepository: IAssistantRepository
    ) { }

    async execute (assistantId: string): Promise<EraseAssistantUseCaseReturn> {
        this.logger.info('Executing EraseAssistantUseCase::execute');

        if (!assistantId) {
            return { success: false, error: 'An assistant id is required to erase an assistant' };
        }

        const result = await this.assistantRepository.eraseAssistant(assistantId);
        if (!result.success) {
            return { success: false, error: result.error || 'Failed to erase assistant' };
        }
        return { success: true };
    }
}
