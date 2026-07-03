import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IAdventureAppendChatService } from '@domain/services';
import { AppendChatUseCaseParams, AppendChatUseCaseReturn, IAdventureAppendChatUseCase } from '@domain/use-cases';

export class AdventureAppendChatUseCase implements IAdventureAppendChatUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository,
        private readonly service: IAdventureAppendChatService
    ) { }

    async execute(params: AppendChatUseCaseParams): Promise<AppendChatUseCaseReturn> {
        this.logger.info('Executing AdventureAppendChatUseCase::execute');
        this.logger.debug('Executing AdventureAppendChatUseCase::execute - params', params);

        const { adventure, message } = params;

        const chatCreated = this.service.createChat({ chat: message });

        if (!chatCreated.success) {
            this.logger.error('AdventureAppendChatUseCase::execute - failed to create chat');
            return {
                success: false,
                error: 'Failed to create chat'
            };
        }

        if (!chatCreated.chat) {
            throw new Error('success is true but does not have an chat object');
        }

        this.logger.debug('AdventureAppendChatUseCase::execute - before updating adventure', adventure);
        adventure.chat.push(chatCreated.chat);
        adventure.updatedAt = new Date();
        this.logger.debug('AdventureAppendChatUseCase::execute - after updating adventure', adventure);

        const response = await this.adventureRepository.updateAdventure({ adventure });

        if (!response) {
            throw new Error('Failed to save adventure');
        }

        return {
            success: true,
            adventure
        };
    }
}
