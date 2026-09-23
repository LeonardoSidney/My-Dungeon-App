import { useCallback } from 'react';
import { HandleNavChatIndexParams } from '../constants';
import { handleNavChatIndex } from '../handleNavChatIndex';

export function useNavChatIndex ({
    currentAdventure,
    setCurrentAdventure,
}: HandleNavChatIndexParams) {
    const onNavigateChatIndex = useCallback(
        (chatId: string, direction: -1 | 1) => {
            const navigate = handleNavChatIndex({ currentAdventure, setCurrentAdventure });
            navigate(chatId, direction);
        },
        [currentAdventure, setCurrentAdventure]
    );

    return onNavigateChatIndex;
}
