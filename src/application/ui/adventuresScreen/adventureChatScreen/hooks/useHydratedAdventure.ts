import { useEffect, useRef, useState } from 'react';
import { Adventure } from '@domain/entities';
import { HydratedAdventure } from '@domain/use-cases';
import { UseHydratedAdventureParams } from './constants';

function getHydrationKey (adventure: Adventure): string {
    return JSON.stringify({
        id: adventure.id,
        characterIds: adventure.characterIds,
        worldMasterId: adventure.worldMasterId,
        characterAsWorldMasterId: adventure.characterAsWorldMasterId,
        charactersControlledByAi: adventure.charactersControlledByAi,
        worldIds: adventure.worldIds,
        locationIds: adventure.locationIds,
        itemIds: adventure.itemIds,
        systemPromptIds: adventure.systemPromptIds
    });
}

export function useHydratedAdventure ({ adventure, hydrateAdventure }: UseHydratedAdventureParams) {
    const [hydrated, setHydrated] = useState<HydratedAdventure | null>(null);
    const [hydratedError, setHydratedError] = useState<string | null>(null);
    const hydratedRef = useRef<HydratedAdventure | null>(null);
    const hydrationKey = getHydrationKey(adventure);
    const structuralAdventureRef = useRef(adventure);
    const previousHydrationKeyRef = useRef(hydrationKey);

    if (previousHydrationKeyRef.current !== hydrationKey) {
        previousHydrationKeyRef.current = hydrationKey;
        structuralAdventureRef.current = adventure;
    }

    useEffect(() => {
        let cancelled = false;
        const structuralAdventure = structuralAdventureRef.current;

        setHydrated(null);
        setHydratedError(null);
        hydratedRef.current = null;

        const hydrate = async () => {
            const response = await hydrateAdventure.handle({ adventure: structuralAdventure });
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
    }, [hydrationKey, hydrateAdventure]);

    return { hydrated, hydratedRef, hydratedError };
}
