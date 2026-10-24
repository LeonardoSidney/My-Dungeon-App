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
            adventureId: params.adventureId,
            chatId: params.chatId,
        });

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('DeleteChatAdventureUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        const response = this.deleteChatAdventureService.deleteChat({ chatId: params.chatId, adventure });

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
            adventure: response.adventure,
        };
    }

    private validate (params: DeleteChatAdventureUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        if (!params.chatId?.trim()) {
            return 'Chat id is required';
        }

        return null;
    }
}
