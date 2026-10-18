import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IDeleteThinkAdventureService } from '@domain/services';
import {
    IDeleteThinkAdventureUseCase,
    DeleteThinkAdventureUseCaseParams,
    DeleteThinkAdventureUseCaseReturn,
} from '@domain/use-cases';

export class DeleteThinkAdventureUseCase implements IDeleteThinkAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly deleteThinkAdventureService: IDeleteThinkAdventureService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: DeleteThinkAdventureUseCaseParams): Promise<DeleteThinkAdventureUseCaseReturn> {
        this.logger.info('Executing DeleteThinkAdventureUseCase::execute');
        this.logger.debug('Executing DeleteThinkAdventureUseCase::execute - params', {
            adventureId: params.adventure.id,
            chatId: params.chatId,
            index: params.index,
        });

        try {
            this.validate(params);

            const targetThinkLength = params.adventure.chat.find(c => c.id === params.chatId)?.think?.length ?? 0;

            if (targetThinkLength === 1) {
                this.logger.warning('DeleteThinkAdventureUseCase::execute - refusing to delete the only think version', { chatId: params.chatId });
                return { success: false, error: 'The only think version of a chat cannot be deleted' };
            }

            const response = this.deleteThinkAdventureService.deleteThink(params);

            if (!response.success) {
                this.logger.warning('DeleteThinkAdventureUseCase::execute - service failed', response.error);
                return { success: false, error: response.error };
            }

            if (!response.adventure) {
                return { success: false, error: 'Service returned success but no adventure object' };
            }

            const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
            if (!update.success) {
                this.logger.error('DeleteThinkAdventureUseCase::execute - failed to save adventure', update.error);
                return { success: false, error: update.error || 'Failed to save adventure' };
            }

            this.logger.debug('DeleteThinkAdventureUseCase::execute - adventure persisted');

            return {
                success: true,
                chat: response.chat,
                adventure: response.adventure,
            };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in DeleteThinkAdventureUseCase::execute', error);
                return { success: false, error: error.message || 'Delete think failed' };
            }

            this.logger.error('Error in DeleteThinkAdventureUseCase::execute', error);
            return { success: false, error: 'Delete think failed' };
        }
    }

    private validate (params: DeleteThinkAdventureUseCaseParams): void {
        if (!params.chatId?.trim()) {
            throw new Error('Chat id is required');
        }
    }
}
