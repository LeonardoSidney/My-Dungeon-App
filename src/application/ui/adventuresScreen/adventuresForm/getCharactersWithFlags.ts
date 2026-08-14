import { Character } from '@domain/entities';

export function getCharactersWithFlags (
    characters: Character[],
    characterAsWorldMasterId: string | undefined,
    charactersControlledByAi: string[] = []
): Character[] {
    return characters.map(character => {
        const updatedCharacter = { ...character };

        if (character.id === characterAsWorldMasterId) {
            updatedCharacter.worldMaster = true;
        }

        if (charactersControlledByAi.includes(character.id)) {
            updatedCharacter.aiControlled = true;
        }

        return updatedCharacter;
    });
}
