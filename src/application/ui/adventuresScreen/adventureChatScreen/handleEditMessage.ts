import { Adventure } from '@domain/entities';
import { HandleEditMessageParams } from './constants';

export const buildEditedAdventure = (adventure: Adventure, chatId: string, newContent: string): Adventure => {
    const updatedChats = adventure.chat.map(chat => {
        if (chat.id !== chatId) return chat;

        const updatedContent = chat.content.map((content, i) => {
            if (i !== chat.index) return content;
            return newContent;
        });

        return { ...chat, content: updatedContent, updatedAt: new Date() };
    });

    return { ...adventure, chat: updatedChats };
};

export const handleEditMessage = ({
    currentAdventure,
    setCurrentAdventure,
}: HandleEditMessageParams) => {
    const onEdit = (chatId: string, newContent: string) => {
        if (!newContent.trim()) return;

        const updatedAdventure = buildEditedAdventure(currentAdventure, chatId, newContent);
        setCurrentAdventure(updatedAdventure);
    };

    return onEdit;
};
