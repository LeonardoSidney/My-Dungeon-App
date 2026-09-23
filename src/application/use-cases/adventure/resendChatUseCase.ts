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
            adventureId: params.adventure.id,
            chatId: params.chatId,
        });

        try {
            this.validate(params);

            const response = this.resendChatService.resendChat(params);

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

            return {
                success: true,
                adventure: response.adventure,
            };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in ResendChatUseCase::execute', error);
                return { success: false, error: error.message || 'Resend chat failed' };
            }

            this.logger.error('Error in ResendChatUseCase::execute', error);
            return { success: false, error: 'Resend chat failed' };
        }
    }

    private validate (params: ResendChatUseCaseParams): void {
        if (!params.chatId?.trim()) {
            throw new Error('Chat id is required');
        }
    }
}
