import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const DEFAULT_ERROR = 'Falha ao carregar a aventura';

export type QueryResult<T> = {
    success: boolean;
    value?: T;
    error?: string;
};

export function useFocusedQuery<T> (load: () => Promise<QueryResult<T>>) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const sequenceRef = useRef(0);

    const run = useCallback(async (reset: boolean): Promise<void> => {
        if (reset) {
            setData(null);
            setError(null);
            setIsLoaded(false);
        }

        sequenceRef.current += 1;
        const sequence = sequenceRef.current;
        const response = await load();
        if (sequence !== sequenceRef.current) {
            return;
        }

        if (!response.success || response.value === undefined) {
            setError(response.error ?? DEFAULT_ERROR);
            return;
        }

        setData(response.value);
        setIsLoaded(true);
    }, [load]);

    const reload = useCallback(() => run(false), [run]);

    useEffect(() => {
        run(true);
    }, [run]);

    useFocusEffect(
        useCallback(() => {
            if (!isLoaded) {
                return;
            }

            run(false);
        }, [isLoaded, run])
    );

    return { data, error, isLoaded, reload, setData: setData as Dispatch<SetStateAction<T | null>> };
}
