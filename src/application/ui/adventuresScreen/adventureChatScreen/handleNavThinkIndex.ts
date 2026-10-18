import { HandleNavThinkIndexParams } from './constants';

export const handleNavThinkIndex = ({
    currentAdventure,
    setCurrentAdventure,
}: HandleNavThinkIndexParams) => {
    const onNavigate = (chatId: string, direction: -1 | 1) => {
        const chatIndex = currentAdventure.chat.findIndex(c => c.id === chatId);
        if (chatIndex === -1) return;

        const targetChat = currentAdventure.chat[chatIndex];
        if (!targetChat.think || targetChat.think.length <= 1) return;

        const maxIndex = targetChat.think.length - 1;
        const nextIndex = Math.min(Math.max(targetChat.thinkIndex + direction, 0), maxIndex);
        if (nextIndex === targetChat.thinkIndex) return;

        const updatedChat = { ...targetChat, thinkIndex: nextIndex, updatedAt: new Date() };
        const updatedChats = currentAdventure.chat.map((c, i) => (i === chatIndex ? updatedChat : c));
        setCurrentAdventure({ ...currentAdventure, chat: updatedChats, updatedAt: new Date() });
    };

    return onNavigate;
};
