import { AdventureFormData } from '../constants';
import { Character, WorldMaster, SystemPrompt, World, Location, Item } from '@domain/entities';

function toggleInList<T extends { id: string; }> (list: T[], item: T): T[] {
    const isItemSelected = list.some(entry => entry.id === item.id);
    if (isItemSelected) return list.filter(entry => entry.id !== item.id);
    return [...list, item];
}

export function useAdventureFormLogic (
    adventureStateFormData: AdventureFormData,
    characters: Character[],
    onChange: (field: keyof AdventureFormData, value: AdventureFormData[keyof AdventureFormData]) => void
) {
    const characterAsWorldMasterId = adventureStateFormData.characterAsWorldMasterId;
    const formDataCharactersControlledByAi = adventureStateFormData.charactersControlledByAi;
    const formSelectedCharacters = adventureStateFormData.characters;
    const worldMaster = adventureStateFormData.worldMaster;

    const filteredCharacters = characters.filter(
        character =>
            character.id !== characterAsWorldMasterId && !formDataCharactersControlledByAi.includes(character.id)
    );

    const removeCharacterFromBuckets = (id: string): {
        characters: Character[];
        aiIds: string[];
        wmCharId?: string;
    } => {
        const charactersWithout = formSelectedCharacters.filter(character => character.id !== id);
        const aiIdsWithout = formDataCharactersControlledByAi.filter(existingId => existingId !== id);
        const wmCharId = characterAsWorldMasterId === id ? undefined : characterAsWorldMasterId;
        return { characters: charactersWithout, aiIds: aiIdsWithout, wmCharId };
    };

    const restoreCharacterAsPlayable = (id: string, bucketCharacters: Character[]): Character[] => {
        const character = bucketCharacters.find(entry => entry.id === id);
        if (!character) {
            return bucketCharacters;
        }
        const charactersWithout = bucketCharacters.filter(entry => entry.id !== id);
        return [...charactersWithout, character];
    };

    const handleSystemPromptToggle = (systemPrompt: SystemPrompt) => {
        onChange('systemPrompts', toggleInList(adventureStateFormData.systemPrompts, systemPrompt));
    };

    const handleCharacterToggle = (character: Character) => {
        const isPlayable = formSelectedCharacters.some(entry => entry.id === character.id);
        if (isPlayable) {
            onChange('characters', formSelectedCharacters.filter(entry => entry.id !== character.id));
            return;
        }
        const cleaned = removeCharacterFromBuckets(character.id);
        onChange('characters', [...cleaned.characters, character]);
        onChange('charactersControlledByAi', cleaned.aiIds);
        onChange('characterAsWorldMasterId', cleaned.wmCharId);
    };

    const handleAiCharacterToggle = (character: Character) => {
        const isAiControlled = formDataCharactersControlledByAi.includes(character.id);
        if (isAiControlled) {
            onChange('charactersControlledByAi', formDataCharactersControlledByAi.filter(id => id !== character.id));
            return;
        }
        const cleaned = removeCharacterFromBuckets(character.id);
        onChange('characters', cleaned.characters);
        onChange('charactersControlledByAi', [...cleaned.aiIds, character.id]);
        onChange('characterAsWorldMasterId', cleaned.wmCharId);
    };

    const handleWorldMasterCharacterSelect = (selectedCharacter: Character) => {
        const isCurrent = characterAsWorldMasterId === selectedCharacter.id;
        if (isCurrent) {
            onChange('characterAsWorldMasterId', undefined);
            onChange('characters', restoreCharacterAsPlayable(selectedCharacter.id, formSelectedCharacters));
            return;
        }
        const cleaned = removeCharacterFromBuckets(selectedCharacter.id);
        const restoredCharacters = characterAsWorldMasterId
            ? restoreCharacterAsPlayable(characterAsWorldMasterId, cleaned.characters)
            : cleaned.characters;
        onChange('characters', restoredCharacters);
        onChange('charactersControlledByAi', cleaned.aiIds);
        onChange('characterAsWorldMasterId', selectedCharacter.id);
        onChange('worldMaster', undefined);
    };

    const handleWorldMasterSelect = (worldMasterEntity: WorldMaster) => {
        const isCurrent = worldMaster?.id === worldMasterEntity.id;
        if (isCurrent) {
            onChange('worldMaster', undefined);
            return;
        }
        if (characterAsWorldMasterId) {
            const restoredCharacters = restoreCharacterAsPlayable(characterAsWorldMasterId, formSelectedCharacters);
            onChange('characters', restoredCharacters);
            onChange('characterAsWorldMasterId', undefined);
        }
        onChange('worldMaster', worldMasterEntity);
    };

    const handleWorldToggle = (world: World) => {
        onChange('worlds', toggleInList(adventureStateFormData.worlds ?? [], world));
    };

    const handleLocationToggle = (location: Location) => {
        onChange('locations', toggleInList(adventureStateFormData.locations ?? [], location));
    };

    const handleItemToggle = (item: Item) => {
        onChange('items', toggleInList(adventureStateFormData.items ?? [], item));
    };

    return {
        characterAsWorldMasterId,
        formDataCharactersControlledByAi,
        formSelectedCharacters,
        filteredCharacters,
        handleSystemPromptToggle,
        handleCharacterToggle,
        handleAiCharacterToggle,
        handleWorldMasterCharacterSelect,
        handleWorldMasterSelect,
        handleWorldToggle,
        handleLocationToggle,
        handleItemToggle,
    };
}
