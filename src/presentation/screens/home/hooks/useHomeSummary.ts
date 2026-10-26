import { useCallback } from 'react';
import { HomeSummaryView, IGetHomeSummaryController } from '@domain/controllers';
import { useFocusedQuery, type QueryResult } from '@presentation/hooks';

export function useHomeSummary (getHomeSummary: IGetHomeSummaryController) {
    const load = useCallback(async (): Promise<QueryResult<HomeSummaryView>> => {
        const response = await getHomeSummary.handle();
        return { success: response.success, value: response.data, error: response.error };
    }, [getHomeSummary]);

    return useFocusedQuery(load);
}
