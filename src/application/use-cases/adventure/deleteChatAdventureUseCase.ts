import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IDeleteChatAdventureService } from '@domain/services';
import {
    IDeleteChatAdventureUseCase,
    DeleteChatAdventureUseCaseParams,
    DeleteChatAdventureUseCaseReturn,
} from '@domain/use-cases';

export class DeleteChatAdventureUseCase implements IDeleteChatAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly deleteChatAdventureService: IDeleteChatAdventureService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: DeleteChatAdventureUseCaseParams): Promise<DeleteChatAdventureUseCaseReturn> {
        this.logger.info('Executing DeleteChatAdventureUseCase::execute');
        this.logger.debug('Executing DeleteChatAdventureUseCase::execute - params', {
            adventureId: params.adventure.id,
            chatId: params.chatId,
            index: params.index,
        });

        try {
            this.validate(params);

            const response = this.deleteChatAdventureService.deleteChat(params);

            if (!response.success) {
                this.logger.warning('DeleteChatAdventureUseCase::execute - service failed', response.error);
                return { success: false, error: response.error };
            }

            if (!response.adventure) {
                return { success: false, error: 'Service returned success but no adventure object' };
            }

            const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
            if (!update.success) {
                this.logger.error('DeleteChatAdventureUseCase::execute - failed to save adventure', update.error);
                return { success: false, error: update.error || 'Failed to save adventure' };
            }

            this.logger.debug('DeleteChatAdventureUseCase::execute - adventure persisted');

            return {
                success: true,
                chat: response.chat,
                adventure: response.adventure,
            };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in DeleteChatAdventureUseCase::execute', error);
                return { success: false, error: error.message || 'Delete chat failed' };
            }

            this.logger.error('Error in DeleteChatAdventureUseCase::execute', error);
            return { success: false, error: 'Delete chat failed' };
        }
    }

    private validate (params: DeleteChatAdventureUseCaseParams): void {
        if (!params.chatId?.trim()) {
            throw new Error('Chat id is required');
        }
    }
}
