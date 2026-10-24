import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IResendChatService } from '@domain/services';
import {
    IResendChatUseCase,
    ResendChatUseCaseParams,
    ResendChatUseCaseReturn,
} from '@domain/use-cases';

export class ResendChatUseCase implements IResendChatUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly resendChatService: IResendChatService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: ResendChatUseCaseParams): Promise<ResendChatUseCaseReturn> {
        this.logger.info('Executing ResendChatUseCase::execute');
        this.logger.debug('Executing ResendChatUseCase::execute - params', {
            adventureId: params.adventureId,
            chatId: params.chatId,
        });

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('ResendChatUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        const chatId = params.chatId ?? adventure.chat[adventure.chat.length - 1]?.id;
        if (!chatId) {
            return { success: false, error: 'No chat history to resend' };
        }

        const response = this.resendChatService.resendChat({ ...params, chatId, adventure });

        if (!response.success) {
            this.logger.warning('ResendChatUseCase::execute - service failed', response.error);
            return { success: false, error: response.error };
        }

        if (!response.adventure) {
            return { success: false, error: 'Service returned success but no adventure object' };
        }

        const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
        if (!update.success) {
            this.logger.error('ResendChatUseCase::execute - failed to save adventure', update.error);
            return { success: false, error: update.error || 'Failed to save adventure' };
        }

        this.logger.debug('ResendChatUseCase::execute - adventure persisted');

        return { success: true };
    }

    private validate (params: ResendChatUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }
}
