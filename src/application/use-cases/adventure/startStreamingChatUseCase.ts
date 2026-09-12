import { ILogger } from '@domain/logger';
import { IStartStreamingChatService } from '@domain/services';
import { IAdventureRepository } from '@domain/repository';
import {
    StartStreamingChatUseCaseParams,
    StartStreamingChatUseCaseReturn,
    IStartStreamingChatUseCase,
} from '@domain/use-cases';

export class StartStreamingChatUseCase implements IStartStreamingChatUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly startStreamingChatService: IStartStreamingChatService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: StartStreamingChatUseCaseParams): Promise<StartStreamingChatUseCaseReturn> {
        this.logger.info('Executing StartStreamingChatUseCase::execute');
        this.logger.debug('StartStreamingChatUseCase::execute - params', params);

        const validation = this.validate(params);
        if (!validation.success) {
            return validation;
        }

        const response = this.startStreamingChatService.startStreamingChat({
            adventure: params.adventure,
            role: params.role,
            characterId: params.characterId,
            chatId: params.chatId,
        });

        if (!response.success) {
            this.logger.warning('StartStreamingChatUseCase::execute - service failed', response.error);
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
            this.logger.error('StartStreamingChatUseCase::execute - failed to save adventure', update.error);
            return {
                success: false,
                error: update.error || 'Failed to save adventure',
            };
        }

        this.logger.debug('StartStreamingChatUseCase::execute - adventure persisted');

        return {
            success: true,
            chat: response.chat,
            adventure: response.adventure,
        };
    }

    private validate (params: StartStreamingChatUseCaseParams): StartStreamingChatUseCaseReturn {
        if (!params.characterId?.trim()) {
            this.logger.warning('StartStreamingChatUseCase::validate - characterId is required');
            return {
                success: false,
                error: 'Character id is required',
            };
        }

        return { success: true };
    }
}
