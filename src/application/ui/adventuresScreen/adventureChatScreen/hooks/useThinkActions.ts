import { useCallback } from 'react';
import { UseThinkActionsParams } from './constants';

export function useThinkActions ({
    adventureId,
    messages,
    reloadMessages,
    deleteThinkVersion,
    alert,
}: UseThinkActionsParams) {
    const onDeleteThink = useCallback(
        async (chatId: string) => {
            const think = messages.find(entry => entry.id === chatId)?.think;
            if (!think) return;

            const response = await deleteThinkVersion.handle({ adventureId, chatId, versionIndex: think.index });

            if (!response.success) {
                alert.handle({ title: 'Erro', message: response.error ?? 'Failed to delete think' });
                return;
            }

            await reloadMessages();
        },
        [adventureId, messages, reloadMessages, deleteThinkVersion, alert]
    );

    return { onDeleteThink };
}
