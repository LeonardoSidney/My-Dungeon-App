import { HandleNavVersionIndexParams } from './constants';

export const handleNavVersionIndex = ({
    adventureId,
    kind,
    reloadMessages,
    selectChatVersion,
}: HandleNavVersionIndexParams) => {
    const onNavigate = async (chatId: string, direction: -1 | 1): Promise<void> => {
        const response = await selectChatVersion.handle({ adventureId, chatId, direction, kind });

        if (response.success) {
            await reloadMessages();
        }
    };

    return onNavigate;
};
