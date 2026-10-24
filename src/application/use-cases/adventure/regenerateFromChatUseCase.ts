import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IRegenerateFromChatService } from '@domain/services';
import {
    IRegenerateFromChatUseCase,
    RegenerateFromChatUseCaseParams,
    RegenerateFromChatUseCaseReturn,
} from '@domain/use-cases';

export class RegenerateFromChatUseCase implements IRegenerateFromChatUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly regenerateFromChatService: IRegenerateFromChatService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: RegenerateFromChatUseCaseParams): Promise<RegenerateFromChatUseCaseReturn> {
        this.logger.info('Executing RegenerateFromChatUseCase::execute');
        this.logger.debug('Executing RegenerateFromChatUseCase::execute - params', {
            adventureId: params.adventureId,
            chatId: params.chatId,
        });

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('RegenerateFromChatUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        const response = this.regenerateFromChatService.regenerateFromChat({ ...params, adventure });

        if (!response.success) {
            this.logger.warning('RegenerateFromChatUseCase::execute - service failed', response.error);
            return { success: false, error: response.error };
        }

        if (!response.adventure) {
            return { success: false, error: 'Service returned success but no adventure object' };
        }

        const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
        if (!update.success) {
            this.logger.error('RegenerateFromChatUseCase::execute - failed to save adventure', update.error);
            return { success: false, error: update.error || 'Failed to save adventure' };
        }

        this.logger.debug('RegenerateFromChatUseCase::execute - adventure persisted');

        return {
            success: true,
            replyChatId: response.chat?.id,
        };
    }

    private validate (params: RegenerateFromChatUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        if (!params.chatId?.trim()) {
            return 'Chat id is required';
        }

        return null;
    }
}
