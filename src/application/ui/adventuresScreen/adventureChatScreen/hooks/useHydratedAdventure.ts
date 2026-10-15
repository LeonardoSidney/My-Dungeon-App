import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Adventure } from '@domain/entities';
import { HydrateAdventureControllerResponse } from '@domain/controllers';
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

const DEFAULT_HYDRATION_ERROR = 'Falha ao carregar a aventura';

export function useHydratedAdventure ({ adventure, hydrateAdventure }: UseHydratedAdventureParams) {
    const [hydrated, setHydrated] = useState<HydratedAdventure | null>(null);
    const [hydratedError, setHydratedError] = useState<string | null>(null);
    const hydratedRef = useRef<HydratedAdventure | null>(null);
    const hydrationKey = getHydrationKey(adventure);
    const structuralAdventureRef = useRef(adventure);
    const previousHydrationKeyRef = useRef(hydrationKey);
    const sequenceRef = useRef(0);

    if (previousHydrationKeyRef.current !== hydrationKey) {
        previousHydrationKeyRef.current = hydrationKey;
        structuralAdventureRef.current = adventure;
    }

    const applyHydration = useCallback((sequence: number, response: HydrateAdventureControllerResponse): void => {
        if (sequence !== sequenceRef.current) {
            return;
        }

        if (!response.success || !response.hydrated) {
            hydratedRef.current = null;
            setHydrated(null);
            setHydratedError(response.error ?? DEFAULT_HYDRATION_ERROR);
            return;
        }

        hydratedRef.current = response.hydrated;
        setHydrated(response.hydrated);
    }, []);

    const hydrate = useCallback(async (reset: boolean): Promise<void> => {
        if (reset) {
            setHydrated(null);
            setHydratedError(null);
            hydratedRef.current = null;
        }

        sequenceRef.current += 1;
        const sequence = sequenceRef.current;
        const structuralAdventure = structuralAdventureRef.current;
        const response = await hydrateAdventure.handle({ adventure: structuralAdventure });
        applyHydration(sequence, response);
    }, [hydrateAdventure, applyHydration]);

    useEffect(() => {
        hydrate(true);
    }, [hydrate, hydrationKey]);

    useFocusEffect(
        useCallback(() => {
            if (hydratedRef.current === null) {
                return;
            }

            hydrate(false);
        }, [hydrate])
    );

    return { hydrated, hydratedRef, hydratedError };
}
