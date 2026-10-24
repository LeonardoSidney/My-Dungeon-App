import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { ISelectChatVersionService } from '@domain/services';
import {
    ISelectChatVersionUseCase,
    SelectChatVersionUseCaseParams,
    SelectChatVersionUseCaseReturn,
} from '@domain/use-cases';

export class SelectChatVersionUseCase implements ISelectChatVersionUseCase {
    constructor (
    private readonly logger: ILogger,
    private readonly service: ISelectChatVersionService,
    private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: SelectChatVersionUseCaseParams): Promise<SelectChatVersionUseCaseReturn> {
        this.logger.info('Executing SelectChatVersionUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('SelectChatVersionUseCase::execute - failed to load adventure', adventureResponse.error);
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

        const currentIndex = params.kind === 'content' ? chat.index : chat.thinkIndex;
        const versionCount = params.kind === 'content' ? chat.content.length : chat.think?.length ?? 0;
        const index = Math.min(Math.max(currentIndex + params.direction, 0), Math.max(versionCount - 1, 0));
        if (index === currentIndex) {
            return { success: true };
        }

        const response = this.service.selectVersion({
            chatId: params.chatId,
            kind: params.kind,
            index,
            adventure,
        });
        if (!response.success || !response.adventure) {
            return { success: false, error: response.error ?? 'Failed to select chat version' };
        }

        const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
        if (!update.success) {
            return { success: false, error: update.error ?? 'Failed to save selected chat version' };
        }

        return { success: true };
    }

    private validate (params: SelectChatVersionUseCaseParams): string | null {
        if (!params.adventureId.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }
}
