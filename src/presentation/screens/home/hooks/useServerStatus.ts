import { useCallback } from 'react';
import { useFocusedQuery, type QueryResult } from '@presentation/hooks';
import type { AppControllers } from '@presentation/providers/appControllers';
import { summarizeServers, type ServerStatus } from '../homeOverview';

enum ServerControllerEnum {
    GET_CONNECTIONS = 'getConnections',
    GET_MODELS = 'getModels',
}

type ServerControllerKey = ServerControllerEnum.GET_CONNECTIONS | ServerControllerEnum.GET_MODELS;

type ServerControllers = Pick<AppControllers, ServerControllerKey>;

export function useServerStatus ({ getConnections, getModels }: ServerControllers) {
    const load = useCallback(async (): Promise<QueryResult<ServerStatus[]>> => {
        const [connections, models] = await Promise.all([getConnections.handle(), getModels.handle()]);
        if (!connections.success) {
            return { success: false, error: connections.error };
        }
        return { success: true, value: summarizeServers(connections.items ?? [], models.items ?? []) };
    }, [getConnections, getModels]);

    return useFocusedQuery(load);
}
