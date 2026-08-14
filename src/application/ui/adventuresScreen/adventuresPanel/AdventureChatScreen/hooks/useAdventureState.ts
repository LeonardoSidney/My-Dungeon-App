import { useState } from 'react';
import { Adventure } from '@domain/entities';

interface UseAdventureStateParams {
    adventure: Adventure;
}

export function useAdventureState ({ adventure }: UseAdventureStateParams) {
    const [currentAdventure, setCurrentAdventure] = useState<Adventure>(adventure);

    return {
        currentAdventure,
        setCurrentAdventure
    };
}
