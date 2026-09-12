import { useCallback, useEffect, useRef, useState } from 'react';

export type UseEntityListParams<T> = {
    fetch: () => Promise<T[]>;
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
        try {
            setItems(await paramsRef.current.fetch());
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    return {
        items,
        isLoading,
        isError,
        reload,
    };
}
