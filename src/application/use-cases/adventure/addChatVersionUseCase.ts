import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IAddChatVersionService } from '@domain/services';
import {
    IAddChatVersionUseCase,
    AddChatVersionUseCaseParams,
    AddChatVersionUseCaseReturn,
} from '@domain/use-cases';

export class AddChatVersionUseCase implements IAddChatVersionUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly addChatVersionService: IAddChatVersionService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: AddChatVersionUseCaseParams): Promise<AddChatVersionUseCaseReturn> {
        this.logger.info('Executing AddChatVersionUseCase::execute');
        this.logger.debug('Executing AddChatVersionUseCase::execute - params', {
            adventureId: params.adventureId,
            chatId: params.chatId,
        });

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('AddChatVersionUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        const chat = adventure.chat.find(entry => entry.id === params.chatId);
        if (!chat) {
            return { success: false, error: `Chat with id ${params.chatId} was not found` };
        }

        const response = this.addChatVersionService.addVersion({
            ...params,
            role: chat.role,
            characterId: chat.characterId,
            adventure,
        });

        if (!response.success) {
            this.logger.warning('AddChatVersionUseCase::execute - service failed', response.error);
            return { success: false, error: response.error };
        }

        if (!response.adventure) {
            return { success: false, error: 'Service returned success but no adventure object' };
        }

        const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
        if (!update.success) {
            this.logger.error('AddChatVersionUseCase::execute - failed to save adventure', update.error);
            return { success: false, error: update.error || 'Failed to save adventure' };
        }

        this.logger.debug('AddChatVersionUseCase::execute - adventure persisted');

        return { success: true };
    }

    private validate (params: AddChatVersionUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        if (!params.chatId?.trim()) {
            return 'Chat id is required';
        }

        if (!params.content?.trim()) {
            return 'Content is required to add a chat version';
        }

        return null;
    }
}
