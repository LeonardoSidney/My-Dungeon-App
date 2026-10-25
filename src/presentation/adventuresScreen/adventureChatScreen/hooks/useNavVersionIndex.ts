import { useCallback } from 'react';
import { UseNavVersionIndexParams } from './constants';
import { handleNavVersionIndex } from '../handleNavVersionIndex';

export function useNavVersionIndex ({
    adventureId,
    kind,
    reloadMessages,
    selectChatVersion,
}: UseNavVersionIndexParams) {
    const onNavigate = useCallback(
        (chatId: string, direction: -1 | 1) => {
            const navigate = handleNavVersionIndex({ adventureId, kind, reloadMessages, selectChatVersion });
            return navigate(chatId, direction);
        },
        [adventureId, kind, reloadMessages, selectChatVersion]
    );

    return onNavigate;
}
