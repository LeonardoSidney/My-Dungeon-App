import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IEditChatAdventureService } from '@domain/services';
import {
    IEditChatAdventureUseCase,
    EditChatAdventureUseCaseParams,
    EditChatAdventureUseCaseReturn,
} from '@domain/use-cases';

export class EditChatAdventureUseCase implements IEditChatAdventureUseCase {
    constructor (
    private readonly logger: ILogger,
    private readonly editChatAdventureService: IEditChatAdventureService,
    private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: EditChatAdventureUseCaseParams): Promise<EditChatAdventureUseCaseReturn> {
        this.logger.info('Executing EditChatAdventureUseCase::execute');
        this.logger.debug('Executing EditChatAdventureUseCase::execute - params', {
            adventureId: params.adventure.id,
            chatId: params.chatId,
            role: params.role,
            characterId: params.characterId,
        });

        try {
            this.validate(params);

            const response = this.editChatAdventureService.editChat(params);

            if (!response.success) {
                this.logger.warning('EditChatAdventureUseCase::execute - service failed', response.error);
                return { success: false, error: response.error };
            }

            if (!response.adventure) {
                return { success: false, error: 'Service returned success but no adventure object' };
            }

            const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
            if (!update.success) {
                this.logger.error('EditChatAdventureUseCase::execute - failed to save adventure', update.error);
                return { success: false, error: update.error || 'Failed to save adventure' };
            }

            this.logger.debug('EditChatAdventureUseCase::execute - adventure persisted');

            return {
                success: true,
                chat: response.chat,
                adventure: response.adventure,
            };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in EditChatAdventureUseCase::execute', error);
                return { success: false, error: error.message || 'Edit chat failed' };
            }

            this.logger.error('Error in EditChatAdventureUseCase::execute', error);
            return { success: false, error: 'Edit chat failed' };
        }
    }

    private validate (params: EditChatAdventureUseCaseParams): void {
        if (!params.chatId?.trim()) {
            throw new Error('Chat id is required');
        }

        if (!params.content?.trim()) {
            throw new Error('Content is required to edit a chat');
        }

        if (!params.characterId?.trim()) {
            throw new Error('Character id is required to edit a chat');
        }
    }
}
