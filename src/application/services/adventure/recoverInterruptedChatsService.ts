import { Adventure, Chat } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IDeleteChatAdventureService,
    IDeleteChatVersionService,
    IFinishStreamingChatService,
    IRecoverInterruptedChatsService,
    RecoverInterruptedChatsServiceParams,
    RecoverInterruptedChatsServiceReturn,
    RepairInterruptedChatReturn,
} from '@domain/services';

export class RecoverInterruptedChatsService implements IRecoverInterruptedChatsService {
    constructor (
        private readonly logger: ILogger,
        private readonly finishStreamingChatService: IFinishStreamingChatService,
        private readonly deleteChatVersionService: IDeleteChatVersionService,
        private readonly deleteChatAdventureService: IDeleteChatAdventureService
    ) { }

    recover (params: RecoverInterruptedChatsServiceParams): RecoverInterruptedChatsServiceReturn {
        this.logger.info('Executing RecoverInterruptedChatsService::recover');

        const interrupted = params.adventure.chat.filter(chat => chat.isStreaming);
        let adventure = params.adventure;

        for (const chat of interrupted) {
            const repaired = this.repair(adventure, chat);
            if (!repaired.success || !repaired.adventure) {
                this.logger.warning('RecoverInterruptedChatsService::recover - failed to repair chat', { chatId: chat.id, error: repaired.error });
                return { success: false, error: repaired.error ?? `Failed to recover chat ${chat.id}` };
            }

            adventure = repaired.adventure;
        }

        return { success: true, adventure, recoveredChatIds: interrupted.map(chat => chat.id) };
    }

    private repair (adventure: Adventure, chat: Chat): RepairInterruptedChatReturn {
        if (this.hasGeneratedText(chat)) {
            return this.finishStreamingChatService.finishStreamingChat({ adventure, chatId: chat.id });
        }

        if (chat.content.length > 1) {
            const removed = this.deleteChatVersionService.deleteVersion({ adventure, chatId: chat.id, versionIndex: chat.index });
            if (!removed.success || !removed.adventure) {
                return removed;
            }

            return this.finishStreamingChatService.finishStreamingChat({ adventure: removed.adventure, chatId: chat.id });
        }

        return this.deleteChatAdventureService.deleteChat({ adventure, chatId: chat.id });
    }

    private hasGeneratedText (chat: Chat): boolean {
        const content = chat.content[chat.index] ?? '';
        const think = chat.think?.[chat.thinkIndex]?.content ?? '';
        return Boolean(content.trim() || think.trim());
    }
}
