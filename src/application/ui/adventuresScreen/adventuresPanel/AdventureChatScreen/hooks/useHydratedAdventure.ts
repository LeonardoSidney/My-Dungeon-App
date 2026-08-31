import { useEffect, useRef, useState } from 'react';
import { HydratedAdventure } from '@domain/use-cases';
import { hydrateAdventureController } from '@infra/container';
import { UseHydratedAdventureParams } from './constants';

export function useHydratedAdventure ({ adventure }: UseHydratedAdventureParams) {
    const [hydrated, setHydrated] = useState<HydratedAdventure | null>(null);
    const [hydratedError, setHydratedError] = useState<string | null>(null);
    const hydratedRef = useRef<HydratedAdventure | null>(null);

    useEffect(() => {
        let cancelled = false;

        setHydrated(null);
        setHydratedError(null);
        hydratedRef.current = null;

        const hydrate = async () => {
            const controller = hydrateAdventureController();
            const response = await controller.handle({ adventure });
            if (cancelled) return;
            if (response.success && response.hydrated) {
                hydratedRef.current = response.hydrated;
                setHydrated(response.hydrated);
                return;
            }
            hydratedRef.current = null;
            setHydrated(null);
            setHydratedError(response.error ?? 'Falha ao carregar a aventura');
        };

        hydrate();

        return () => {
            cancelled = true;
        };
    }, [adventure]);

    return { hydrated, hydratedRef, hydratedError };
}
