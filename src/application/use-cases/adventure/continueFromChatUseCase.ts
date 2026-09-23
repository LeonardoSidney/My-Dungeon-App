import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IContinueFromChatService } from '@domain/services';
import {
    IContinueFromChatUseCase,
    ContinueFromChatUseCaseParams,
    ContinueFromChatUseCaseReturn,
} from '@domain/use-cases';

export class ContinueFromChatUseCase implements IContinueFromChatUseCase {
    constructor (
    private readonly logger: ILogger,
    private readonly continueFromChatService: IContinueFromChatService,
    private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: ContinueFromChatUseCaseParams): Promise<ContinueFromChatUseCaseReturn> {
        this.logger.info('Executing ContinueFromChatUseCase::execute');
        this.logger.debug('Executing ContinueFromChatUseCase::execute - params', {
            adventureId: params.adventure.id,
            chatId: params.chatId,
        });

        try {
            this.validate(params);

            const response = this.continueFromChatService.continueFromChat(params);

            if (!response.success) {
                this.logger.warning('ContinueFromChatUseCase::execute - service failed', response.error);
                return { success: false, error: response.error };
            }

            if (!response.adventure) {
                return { success: false, error: 'Service returned success but no adventure object' };
            }

            const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
            if (!update.success) {
                this.logger.error('ContinueFromChatUseCase::execute - failed to save adventure', update.error);
                return { success: false, error: update.error || 'Failed to save adventure' };
            }

            this.logger.debug('ContinueFromChatUseCase::execute - adventure persisted');

            return {
                success: true,
                adventure: response.adventure,
            };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in ContinueFromChatUseCase::execute', error);
                return { success: false, error: error.message || 'Continue from chat failed' };
            }

            this.logger.error('Error in ContinueFromChatUseCase::execute', error);
            return { success: false, error: 'Continue from chat failed' };
        }
    }

    private validate (params: ContinueFromChatUseCaseParams): void {
        if (!params.chatId?.trim()) {
            throw new Error('Chat id is required');
        }
    }
}
