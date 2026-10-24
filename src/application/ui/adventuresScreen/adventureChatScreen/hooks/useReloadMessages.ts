import { useCallback } from 'react';
import { IGetChatMessagesController } from '@domain/controllers';
import { SetMessages } from '../constants';

export function useReloadMessages (adventureId: string, getChatMessages: IGetChatMessagesController, setMessages: SetMessages) {
    return useCallback(async (): Promise<void> => {
        const response = await getChatMessages.handle({ adventureId });
        if (response.success && response.messages) {
            setMessages(response.messages);
        }
    }, [adventureId, getChatMessages, setMessages]);
}
