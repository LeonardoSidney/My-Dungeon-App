import { HandleCharacterSelectFromListParams } from './constants';

export function handleCharacterSelectFromList ({
    character,
    onCharacterSelect,
    setShowList,
}: HandleCharacterSelectFromListParams): void {
    onCharacterSelect(character);
    setShowList(false);
}
