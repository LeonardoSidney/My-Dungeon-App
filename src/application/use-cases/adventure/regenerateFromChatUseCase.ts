import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IRegenerateFromChatService } from '@domain/services';
import {
    IRegenerateFromChatUseCase,
    RegenerateFromChatUseCaseParams,
    RegenerateFromChatUseCaseReturn,
} from '@domain/use-cases';

export class RegenerateFromChatUseCase implements IRegenerateFromChatUseCase {
    constructor (
    private readonly logger: ILogger,
    private readonly regenerateFromChatService: IRegenerateFromChatService,
    private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: RegenerateFromChatUseCaseParams): Promise<RegenerateFromChatUseCaseReturn> {
        this.logger.info('Executing RegenerateFromChatUseCase::execute');
        this.logger.debug('Executing RegenerateFromChatUseCase::execute - params', {
            adventureId: params.adventure.id,
            chatId: params.chatId,
        });

        try {
            this.validate(params);

            const response = this.regenerateFromChatService.regenerateFromChat(params);

            if (!response.success) {
                this.logger.warning('RegenerateFromChatUseCase::execute - service failed', response.error);
                return { success: false, error: response.error };
            }

            if (!response.adventure) {
                return { success: false, error: 'Service returned success but no adventure object' };
            }

            const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
            if (!update.success) {
                this.logger.error('RegenerateFromChatUseCase::execute - failed to save adventure', update.error);
                return { success: false, error: update.error || 'Failed to save adventure' };
            }

            this.logger.debug('RegenerateFromChatUseCase::execute - adventure persisted');

            return {
                success: true,
                adventure: response.adventure,
            };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in RegenerateFromChatUseCase::execute', error);
                return { success: false, error: error.message || 'Regenerate from chat failed' };
            }

            this.logger.error('Error in RegenerateFromChatUseCase::execute', error);
            return { success: false, error: 'Regenerate from chat failed' };
        }
    }

    private validate (params: RegenerateFromChatUseCaseParams): void {
        if (!params.chatId?.trim()) {
            throw new Error('Chat id is required');
        }
    }
}
