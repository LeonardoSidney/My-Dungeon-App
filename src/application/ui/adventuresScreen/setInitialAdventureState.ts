import { AdventureFormData } from './constants';

function generateDefaultName (): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day} ${hours}:${minutes}:${seconds} new adventure`;
}

export function setInitialAdventureState (): AdventureFormData {
    return {
        id: '',
        name: generateDefaultName(),
        systemPrompts: [],
        characters: [],
        worldMaster: undefined,
        characterAsWorldMasterId: undefined,
        avaliableCharacters: [],
        worlds: [],
        locations: [],
        items: [],
        chat: [],
        createdAt: undefined,
        updatedAt: undefined,
    };
}
