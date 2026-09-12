import { Character, WorldMaster } from '@domain/entities';

export interface CharacterRosterProps {
    characters: Character[];
    worldMasters: WorldMaster[];
    selectedCharacters: Character[];
    aiCharacterIds: string[];
    characterAsWorldMasterId?: string;
    worldMaster?: WorldMaster;
    error?: string;
    onToggleCharacter: (character: Character) => void;
    onToggleAiCharacter: (character: Character) => void;
    onCharacterAsWorldMaster: (character: Character) => void;
    onWorldMaster: (worldMaster: WorldMaster) => void;
}
