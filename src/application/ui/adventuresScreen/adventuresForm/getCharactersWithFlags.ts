import { Character } from '@domain/entities';

export function getCharactersWithFlags (
    characters: Character[],
    characterAsWorldMasterId: string | undefined
): Character[] {
    return characters.map((character) => {
        const updatedCharacter = { ...character };

        if (character.id === characterAsWorldMasterId) {
            updatedCharacter.worldMaster = true;
        }

        return updatedCharacter;
    });
}
