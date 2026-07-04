import { ILogger } from '@domain/logger';
import { AdventureAppendChatServiceParams, AdventureAppendChatServiceReturn, IAdventureAppendChatService } from '@domain/services';

export class AdventureAppendChatService implements IAdventureAppendChatService {
    constructor(
        private readonly logger: ILogger
    ) { }

    appendChat(params: AdventureAppendChatServiceParams): AdventureAppendChatServiceReturn {
        this.logger.info('Executing AdventureAppendChatService::appendChat');
        this.logger.debug('AdventureAppendChatService::appendChat - params', params);

        const { adventure, chat } = params;

        if (adventure.chat.some(existingChat => existingChat.id === chat.id)) {
            this.logger.warning('AdventureAppendChatService::appendChat - chat already exists in adventure');
            return {
                success: false,
                error: 'Chat already exists in adventure'
            };
        }

        adventure.chat.push(chat);
        adventure.updatedAt = new Date();

        this.logger.debug('AdventureAppendChatService::appendChat - adventure updated', adventure);

        return {
            success: true,
            adventure
        };
    }
}
