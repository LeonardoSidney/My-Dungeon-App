import { HandleDeleteMessageParams } from './constants';

export const handleDeleteMessage = ({
  currentAdventure,
  setCurrentAdventure,
  setMessage,
}: HandleDeleteMessageParams) => {
  const onDelete = (chatId: string) => {
    if (!currentAdventure.chat) return;

    const index = currentAdventure.chat.findIndex(c => c.id === chatId);
    if (index === -1) return;

    const deletedChat = currentAdventure.chat[index];
    const updatedChats = currentAdventure.chat.slice(0, index);
    const updatedAdventure = { ...currentAdventure, chat: updatedChats };
    setCurrentAdventure(updatedAdventure);
    setMessage(deletedChat.content[0] || '');
  };

  return onDelete;
};
