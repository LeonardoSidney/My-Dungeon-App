import { useCallback } from 'react';
import { HandleNavThinkIndexParams } from '../constants';
import { handleNavThinkIndex } from '../handleNavThinkIndex';

export function useNavThinkIndex ({
    currentAdventure,
    setCurrentAdventure,
}: HandleNavThinkIndexParams) {
    const onNavigateThinkIndex = useCallback(
        (chatId: string, direction: -1 | 1) => {
            const navigate = handleNavThinkIndex({ currentAdventure, setCurrentAdventure });
            navigate(chatId, direction);
        },
        [currentAdventure, setCurrentAdventure]
    );

    return onNavigateThinkIndex;
}
