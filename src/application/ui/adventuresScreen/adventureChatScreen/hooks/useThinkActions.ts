import { useCallback } from 'react';
import { UseThinkActionsParams } from './constants';

export function useThinkActions ({
    currentAdventure,
    setCurrentAdventure,
    deleteThinkAdventure,
    alert,
}: UseThinkActionsParams) {
    const onDeleteThink = useCallback(
        async (chatId: string) => {
            const targetChat = currentAdventure.chat.find(c => c.id === chatId);
            if (!targetChat?.think) return;

            const response = await deleteThinkAdventure.handle({
                adventure: currentAdventure,
                chatId,
                index: targetChat.thinkIndex,
            });

            if (!response.success || !response.adventure) {
                alert.handle({ title: 'Erro', message: response.error ?? 'Failed to delete think' });
                return;
            }

            setCurrentAdventure(response.adventure);
        },
        [currentAdventure, setCurrentAdventure, deleteThinkAdventure, alert]
    );

    return { onDeleteThink };
}
