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

    const filteredCharacters = characters.filter(
        character =>
            character.id !== characterAsWorldMasterId && !formDataCharactersControlledByAi.includes(character.id)
    );

    const handleSystemPromptToggle = (systemPrompt: SystemPrompt) => {
        onChange('systemPrompts', toggleInList(adventureStateFormData.systemPrompts, systemPrompt));
    };

    const handleCharacterToggle = (character: Character) => {
        onChange('characters', toggleInList(formSelectedCharacters, character));
    };

    const handleAiCharacterToggle = (character: Character) => {
        const isCharacterSelected = formDataCharactersControlledByAi.includes(character.id);
        const newCharactersControlledByAi = isCharacterSelected
            ? formDataCharactersControlledByAi.filter(id => id !== character.id)
            : [...formDataCharactersControlledByAi, character.id];
        if (!isCharacterSelected && formSelectedCharacters.some(c => c.id === character.id)) {
            onChange('characters', formSelectedCharacters.filter(c => c.id !== character.id));
        }
        onChange('charactersControlledByAi', newCharactersControlledByAi);
    };

    const handleWorldMasterCharacterSelect = (selectedCharacter: Character) => {
        const newWorldMasterId = characterAsWorldMasterId === selectedCharacter.id ? undefined : selectedCharacter.id;
        if (characterAsWorldMasterId && characterAsWorldMasterId !== newWorldMasterId) {
            onChange('charactersControlledByAi', formDataCharactersControlledByAi.filter(id => id !== characterAsWorldMasterId));
        }
        if (newWorldMasterId && formSelectedCharacters.some(c => c.id === newWorldMasterId)) {
            onChange('characters', formSelectedCharacters.filter(c => c.id !== newWorldMasterId));
        }
        onChange('charactersControlledByAi', formDataCharactersControlledByAi.filter(id => id !== selectedCharacter.id));
        onChange('characterAsWorldMasterId', newWorldMasterId);
    };

    const handleWorldMasterSelect = (worldMaster: WorldMaster) => {
        const newWorldMaster = adventureStateFormData.worldMaster?.id === worldMaster.id ? undefined : worldMaster;
        onChange('worldMaster', newWorldMaster);
        onChange('characters', formSelectedCharacters.filter(c => c.id !== characterAsWorldMasterId));
        onChange('characterAsWorldMasterId', undefined);
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
