import { ILogger } from '@domain/logger';
import { IFinishStreamingChatService } from '@domain/services';
import { IAdventureRepository } from '@domain/repository';
import {
    FinishStreamingChatUseCaseParams,
    FinishStreamingChatUseCaseReturn,
    IFinishStreamingChatUseCase,
} from '@domain/use-cases';

export class FinishStreamingChatUseCase implements IFinishStreamingChatUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly finishStreamingChatService: IFinishStreamingChatService,
        private readonly adventureRepository: IAdventureRepository
    ) {}

    async execute (params: FinishStreamingChatUseCaseParams): Promise<FinishStreamingChatUseCaseReturn> {
        this.logger.info('Executing FinishStreamingChatUseCase::execute');
        this.logger.debug('FinishStreamingChatUseCase::execute - params', params);

        const validation = this.validate(params);
        if (!validation.success) {
            return validation;
        }

        const response = this.finishStreamingChatService.finishStreamingChat({
            adventure: params.adventure,
            chatId: params.chatId,
        });

        if (!response.success) {
            this.logger.warning('FinishStreamingChatUseCase::execute - service failed', response.error);
            return {
                success: false,
                error: response.error,
            };
        }

        if (!response.adventure) {
            throw new Error('Service returned success but no adventure object');
        }

        const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
        if (!update) {
            throw new Error('Failed to save adventure');
        }

        this.logger.debug('FinishStreamingChatUseCase::execute - adventure persisted');

        return {
            success: true,
            chat: response.chat,
            adventure: response.adventure,
        };
    }

    private validate (params: FinishStreamingChatUseCaseParams): FinishStreamingChatUseCaseReturn {
        if (!params.chatId?.trim()) {
            this.logger.warning('FinishStreamingChatUseCase::validate - chatId is required');
            return {
                success: false,
                error: 'Chat ID is required',
            };
        }

        return { success: true };
    }
}
