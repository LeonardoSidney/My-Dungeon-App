import { HandleNavChatIndexParams } from './constants';

export const handleNavChatIndex = ({
    currentAdventure,
    setCurrentAdventure,
}: HandleNavChatIndexParams) => {
    const onNavigate = (chatId: string, direction: -1 | 1) => {
        const chatIndex = currentAdventure.chat.findIndex(c => c.id === chatId);
        if (chatIndex === -1) return;

        const targetChat = currentAdventure.chat[chatIndex];
        if (targetChat.content.length <= 1) return;

        const maxIndex = targetChat.content.length - 1;
        const nextIndex = Math.min(Math.max(targetChat.index + direction, 0), maxIndex);
        if (nextIndex === targetChat.index) return;

        const updatedChat = { ...targetChat, index: nextIndex, updatedAt: new Date() };
        const updatedChats = currentAdventure.chat.map((c, i) => (i === chatIndex ? updatedChat : c));
        setCurrentAdventure({ ...currentAdventure, chat: updatedChats, updatedAt: new Date() });
    };

    return onNavigate;
};
