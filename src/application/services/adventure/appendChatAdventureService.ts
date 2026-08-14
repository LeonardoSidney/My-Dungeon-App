import { ILogger } from '@domain/logger';
import {
    AppendChatAdventureServiceParams,
    AppendChatAdventureServiceReturn,
    IAppendChatAdventureService,
} from '@domain/services';

export class AppendChatAdventureService implements IAppendChatAdventureService {
    constructor (private readonly logger: ILogger) {}

    appendChat (params: AppendChatAdventureServiceParams): AppendChatAdventureServiceReturn {
        this.logger.info('Executing AppendChatAdventureService::appendChat');
        this.logger.debug('AppendChatAdventureService::appendChat - params', params);

        const { adventure, chat } = params;

        if (adventure.chat.some(existingChat => existingChat.id === chat.id)) {
            this.logger.warning('AppendChatAdventureService::appendChat - chat already exists in adventure');
            return {
                success: false,
                error: 'Chat already exists in adventure',
            };
        }

        const updatedAdventure = {
            ...adventure,
            chat: [...adventure.chat, chat],
            updatedAt: new Date(),
        };

        this.logger.debug('AppendChatAdventureService::appendChat - adventure updated', updatedAdventure);

        return {
            success: true,
            adventure: updatedAdventure,
        };
    }
}
