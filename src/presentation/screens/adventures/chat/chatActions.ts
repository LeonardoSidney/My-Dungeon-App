import {
    ChatMessageView,
    ChatReplyUpdateView,
    ChatVersionKind,
    IAlertController,
    IGenerateChatReplyController,
    ISelectChatVersionController,
} from '@domain/controllers';
import { RoleEnum } from '@domain/entities';
import { showError } from '@presentation/utils/showError';
import type { StreamReply, VersionDirection } from './types';

type RequestChatReplyParams = {
    adventureId: string;
    replyChatId?: string;
    skipPlayerTurn?: boolean;
    generateChatReply: IGenerateChatReplyController;
    reloadMessages: () => Promise<void>;
    alert: IAlertController;
};

export async function requestChatReply ({
    adventureId,
    replyChatId,
    skipPlayerTurn,
    generateChatReply,
    reloadMessages,
    alert,
}: RequestChatReplyParams): Promise<void> {
    const response = await generateChatReply.handle({ adventureId, chatId: replyChatId, skipPlayerTurn });

    if (!response.success) {
        showError(alert, response.error, 'Failed to generate the assistant reply');
    }

    await reloadMessages();
}

type HandleChatReplyUpdateParams = {
    update: ChatReplyUpdateView;
    reloadMessage: (chatId: string) => Promise<void>;
    reloadMessages: () => Promise<void>;
    setIsReplying: (isReplying: boolean) => void;
    alert: IAlertController;
};

export async function handleChatReplyUpdate ({ update, reloadMessage, reloadMessages, setIsReplying, alert }: HandleChatReplyUpdateParams): Promise<void> {
    setIsReplying(!update.isFinished);

    if (update.error) {
        showError(alert, update.error, update.error);
    }

    if (update.isFinished) {
        await reloadMessages();
        return;
    }

    await reloadMessage(update.chatId);
}

export function isWaitingForPlayers (messages: ChatMessageView[]): boolean {
    const lastWorldMasterIndex = messages.map(message => message.role).lastIndexOf(RoleEnum.ASSISTANT);
    const currentTurn = messages.slice(lastWorldMasterIndex + 1);

    return !currentTurn.some(message => message.role === RoleEnum.AI_PERSONA);
}

export function upsertChatMessage (messages: ChatMessageView[], message: ChatMessageView): ChatMessageView[] {
    const index = messages.findIndex(entry => entry.id === message.id);
    if (index === -1) {
        return [...messages, message];
    }

    const next = [...messages];
    next[index] = message;
    return next;
}

type HandleReplyActionParams = {
    prepare: () => Promise<{ success: boolean; replyChatId?: string; error?: string; }>;
    fallbackError: string;
    streamReply: StreamReply;
    alert: IAlertController;
};

export async function handleReplyAction ({ prepare, fallbackError, streamReply, alert }: HandleReplyActionParams): Promise<void> {
    const response = await prepare();

    if (!response.success) {
        showError(alert, response.error, fallbackError);
        return;
    }

    await streamReply(response.replyChatId);
}

type NavigateVersionParams = {
    adventureId: string;
    chatId: string;
    kind: ChatVersionKind;
    direction: VersionDirection;
    reloadMessages: () => Promise<void>;
    selectChatVersion: ISelectChatVersionController;
};

export async function navigateVersion ({ adventureId, chatId, kind, direction, reloadMessages, selectChatVersion }: NavigateVersionParams): Promise<void> {
    const response = await selectChatVersion.handle({ adventureId, chatId, direction, kind });

    if (response.success) {
        await reloadMessages();
    }
}
