import { ILogger } from '@domain/logger';
import { IUpdateStreamingChatService } from '@domain/services';
import { IAdventureRepository } from '@domain/repository';
import {
    UpdateStreamingChatUseCaseParams,
    UpdateStreamingChatUseCaseReturn,
    IUpdateStreamingChatUseCase,
} from '@domain/use-cases';

export class UpdateStreamingChatUseCase implements IUpdateStreamingChatUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly updateStreamingChatService: IUpdateStreamingChatService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: UpdateStreamingChatUseCaseParams): Promise<UpdateStreamingChatUseCaseReturn> {
        this.logger.streaming('Executing UpdateStreamingChatUseCase::execute');
        this.logger.streaming('UpdateStreamingChatUseCase::execute - params', params);

        const validation = this.validate(params);
        if (!validation.success) {
            return validation;
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('UpdateStreamingChatUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        const chat = adventure.chat.find(entry => entry.id === params.chatId);
        if (chat && (chat.index < 0 || chat.index >= chat.content.length)) {
            return {
                success: false,
                error: 'Chat index is out of bounds',
            };
        }

        const response = this.updateStreamingChatService.updateStreamingChat({
            adventure,
            chatId: params.chatId,
            content: params.content,
            think: params.think,
        });

        if (!response.success) {
            this.logger.warning('UpdateStreamingChatUseCase::execute - service failed', response.error);
            return {
                success: false,
                error: response.error,
            };
        }

        if (!response.adventure) {
            return {
                success: false,
                error: 'Service returned success but no adventure object',
            };
        }

        const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
        if (!update.success) {
            this.logger.error('UpdateStreamingChatUseCase::execute - failed to save adventure', update.error);
            return {
                success: false,
                error: update.error || 'Failed to save adventure',
            };
        }

        this.logger.streaming('UpdateStreamingChatUseCase::execute - adventure persisted');

        return {
            success: true,
            chat: response.chat,
            adventure: response.adventure,
        };
    }

    private validate (params: UpdateStreamingChatUseCaseParams): UpdateStreamingChatUseCaseReturn {
        if (!params.chatId?.trim()) {
            this.logger.warning('UpdateStreamingChatUseCase::validate - chatId is required');
            return {
                success: false,
                error: 'Chat ID is required',
            };
        }

        if (params.content === undefined) {
            this.logger.warning('UpdateStreamingChatUseCase::validate - content is required');
            return {
                success: false,
                error: 'Content is required',
            };
        }

        if (!params.adventureId?.trim()) {
            this.logger.warning('UpdateStreamingChatUseCase::validate - adventureId is required');
            return {
                success: false,
                error: 'Adventure id is required',
            };
        }

        return { success: true };
    }
}
