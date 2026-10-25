import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ListControllerResponse } from '@domain/controllers';

export type UseEntityListParams<T> = {
    fetch: () => Promise<ListControllerResponse<T>>;
};

export type UseEntityListReturn<T> = {
    items: T[];
    isLoading: boolean;
    isError: boolean;
    reload: () => Promise<void>;
};

export function useEntityList<T> (params: UseEntityListParams<T>): UseEntityListReturn<T> {
    const paramsRef = useRef(params);
    paramsRef.current = params;

    const [items, setItems] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const reload = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setIsError(false);
        const response = await paramsRef.current.fetch();
        setIsLoading(false);

        if (!response.success || !response.items) {
            setIsError(true);
            return;
        }

        setItems(response.items);
    }, []);

    useFocusEffect(
        useCallback(() => {
            reload();
        }, [reload])
    );

    return {
        items,
        isLoading,
        isError,
        reload,
    };
}
