import { useMemo } from 'react';
import { EntityOption } from '@domain/controllers';
import type { AdventureFormData } from '../../form/adventureForm';
import { getGenerationVoices, getPlayerVoices } from '../adventureSettingsForm';

export function useGenerationVoices (adventure: AdventureFormData | undefined, characters: EntityOption[]) {
    const worldMaster = adventure?.worldMaster;
    const characterAsWorldMasterId = adventure?.characterAsWorldMasterId;
    const charactersControlledByAi = adventure?.charactersControlledByAi;
    const playedCharacters = adventure?.characters;

    return useMemo(() => {
        const roster = { worldMaster, characterAsWorldMasterId, charactersControlledByAi: charactersControlledByAi ?? [] };
        const aiVoices = getGenerationVoices(roster, characters);
        const playerVoices = getPlayerVoices(playedCharacters ?? []);
        return { aiVoices, playerVoices, allVoices: [...aiVoices, ...playerVoices] };
    }, [worldMaster, characterAsWorldMasterId, charactersControlledByAi, playedCharacters, characters]);
}
