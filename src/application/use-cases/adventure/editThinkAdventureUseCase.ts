import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IEditThinkAdventureService } from '@domain/services';
import {
    IEditThinkAdventureUseCase,
    EditThinkAdventureUseCaseParams,
    EditThinkAdventureUseCaseReturn,
} from '@domain/use-cases';

export class EditThinkAdventureUseCase implements IEditThinkAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly editThinkAdventureService: IEditThinkAdventureService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: EditThinkAdventureUseCaseParams): Promise<EditThinkAdventureUseCaseReturn> {
        this.logger.info('Executing EditThinkAdventureUseCase::execute');
        this.logger.debug('Executing EditThinkAdventureUseCase::execute - params', {
            adventureId: params.adventure.id,
            chatId: params.chatId,
        });

        try {
            this.validate(params);

            const response = this.editThinkAdventureService.editThink(params);

            if (!response.success) {
                this.logger.warning('EditThinkAdventureUseCase::execute - service failed', response.error);
                return { success: false, error: response.error };
            }

            if (!response.adventure) {
                return { success: false, error: 'Service returned success but no adventure object' };
            }

            const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
            if (!update.success) {
                this.logger.error('EditThinkAdventureUseCase::execute - failed to save adventure', update.error);
                return { success: false, error: update.error || 'Failed to save adventure' };
            }

            this.logger.debug('EditThinkAdventureUseCase::execute - adventure persisted');

            return {
                success: true,
                chat: response.chat,
                adventure: response.adventure,
            };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in EditThinkAdventureUseCase::execute', error);
                return { success: false, error: error.message || 'Edit think failed' };
            }

            this.logger.error('Error in EditThinkAdventureUseCase::execute', error);
            return { success: false, error: 'Edit think failed' };
        }
    }

    private validate (params: EditThinkAdventureUseCaseParams): void {
        if (!params.chatId?.trim()) {
            throw new Error('Chat id is required');
        }

        if (!params.content?.trim()) {
            throw new Error('Content is required to edit a think');
        }
    }
}
