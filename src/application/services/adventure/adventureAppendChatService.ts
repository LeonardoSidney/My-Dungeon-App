import { Chat } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { AdventureAppendChatServiceParams, AdventureAppendChatServiceReturn, IAdventureAppendChatService } from '@domain/services';

export class AdventureAppendChatService implements IAdventureAppendChatService {
    constructor(
        private readonly logger: ILogger
    ) { }

    createChat(params: AdventureAppendChatServiceParams): AdventureAppendChatServiceReturn {
        this.logger.info('Executing AdventureAppendChatService::createChat');

        const chat: Chat = {
            content: params.chat.content,
            role: params.chat.role,
            index: params.chat.index,
            id: params.chat.id,
            think: params.chat.think
        };

        return {
            success: true,
            chat
        };
    }
}
