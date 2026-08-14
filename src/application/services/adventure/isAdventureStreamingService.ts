import { ILogger } from '@domain/logger';
import {
    IsAdventureStreamingServiceParams,
    IsAdventureStreamingServiceReturn,
    IIsAdventureStreamingService,
} from '@domain/services';

export class IsAdventureStreamingService implements IIsAdventureStreamingService {
    constructor (private readonly logger: ILogger) {}

    isAdventureStreaming (params: IsAdventureStreamingServiceParams): IsAdventureStreamingServiceReturn {
        this.logger.info('Executing IsAdventureStreamingService::isAdventureStreaming');
        this.logger.debug('IsAdventureStreamingService::isAdventureStreaming - params', params);

        const { adventure } = params;

        if (!adventure.chat || adventure.chat.length === 0) {
            this.logger.debug('IsAdventureStreamingService::isAdventureStreaming - no chats found');
            return { success: true, isStreaming: false };
        }

        const lastChat = adventure.chat[adventure.chat.length - 1];
        const isStreaming = lastChat.isStreaming === true;

        this.logger.debug('IsAdventureStreamingService::isAdventureStreaming - isStreaming', isStreaming);

        return { success: true, isStreaming };
    }
}
