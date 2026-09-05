import { CharacterFormData } from './constants';

export function setInitialCharacterState (): CharacterFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
        assistant: null,
        abilities: [],
        proficiencies: [],
        statuses: [],
        attributes: [],
    };
}
