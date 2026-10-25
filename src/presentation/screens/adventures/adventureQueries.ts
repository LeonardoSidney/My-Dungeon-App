import { useCallback } from 'react';
import {
    IGetAdventureCharactersController,
    IGetAdventureWorldMasterController,
    IGetAdventureSummaryController,
    IGetChatMessagesController,
} from '@domain/controllers';
import { useFocusedQuery } from '@presentation/hooks';

export function useAdventureSummary (adventureId: string, getAdventureSummary: IGetAdventureSummaryController) {
    const load = useCallback(async () => {
        const response = await getAdventureSummary.handle({ adventureId });
        return { success: response.success, value: response.data, error: response.error };
    }, [adventureId, getAdventureSummary]);

    return useFocusedQuery(load);
}

export function useAdventureCharacters (adventureId: string, getAdventureCharacters: IGetAdventureCharactersController) {
    const load = useCallback(async () => {
        const response = await getAdventureCharacters.handle({ adventureId });
        return { success: response.success, value: response.items, error: response.error };
    }, [adventureId, getAdventureCharacters]);

    return useFocusedQuery(load);
}

export function useAdventureWorldMaster (adventureId: string, getAdventureWorldMaster: IGetAdventureWorldMasterController) {
    const load = useCallback(async () => {
        const response = await getAdventureWorldMaster.handle({ adventureId });
        return { success: response.success, value: response.success ? response.data ?? null : undefined, error: response.error };
    }, [adventureId, getAdventureWorldMaster]);

    return useFocusedQuery(load);
}

export function useChatMessages (adventureId: string, getChatMessages: IGetChatMessagesController) {
    const load = useCallback(async () => {
        const response = await getChatMessages.handle({ adventureId });
        return { success: response.success, value: response.messages, error: response.error };
    }, [adventureId, getChatMessages]);

    return useFocusedQuery(load);
}
