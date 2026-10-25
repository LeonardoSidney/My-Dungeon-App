import { EntityOption } from '@domain/controllers';

export interface CharacterRosterProps {
    characters: EntityOption[];
    worldMasters: EntityOption[];
    selectedCharacters: EntityOption[];
    aiCharacterIds: string[];
    characterAsWorldMasterId?: string;
    worldMaster?: EntityOption;
    error?: string;
    onToggleCharacter: (character: EntityOption) => void;
    onToggleAiCharacter: (character: EntityOption) => void;
    onCharacterAsWorldMaster: (character: EntityOption) => void;
    onWorldMaster: (worldMaster: EntityOption) => void;
}
