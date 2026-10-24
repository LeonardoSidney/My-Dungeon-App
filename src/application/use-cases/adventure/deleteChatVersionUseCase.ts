import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IDeleteChatVersionService } from '@domain/services';
import {
    IDeleteChatVersionUseCase,
    DeleteChatVersionUseCaseParams,
    DeleteChatVersionUseCaseReturn,
} from '@domain/use-cases';

export class DeleteChatVersionUseCase implements IDeleteChatVersionUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly deleteChatVersionService: IDeleteChatVersionService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: DeleteChatVersionUseCaseParams): Promise<DeleteChatVersionUseCaseReturn> {
        this.logger.info('Executing DeleteChatVersionUseCase::execute');
        this.logger.debug('Executing DeleteChatVersionUseCase::execute - params', {
            adventureId: params.adventureId,
            chatId: params.chatId,
            versionIndex: params.versionIndex,
        });

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('DeleteChatVersionUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        const response = this.deleteChatVersionService.deleteVersion({ chatId: params.chatId, versionIndex: params.versionIndex, adventure });

        if (!response.success) {
            this.logger.warning('DeleteChatVersionUseCase::execute - service failed', response.error);
            return { success: false, error: response.error };
        }

        if (!response.adventure) {
            return { success: false, error: 'Service returned success but no adventure object' };
        }

        const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
        if (!update.success) {
            this.logger.error('DeleteChatVersionUseCase::execute - failed to save adventure', update.error);
            return { success: false, error: update.error || 'Failed to save adventure' };
        }

        this.logger.debug('DeleteChatVersionUseCase::execute - adventure persisted');

        return {
            success: true,
            adventure: response.adventure,
        };
    }

    private validate (params: DeleteChatVersionUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        if (!params.chatId?.trim()) {
            return 'Chat id is required';
        }

        return null;
    }
}
