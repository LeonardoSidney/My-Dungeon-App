import { AbilityFormData } from './constants';

export function setInitialAbilityState (): AbilityFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    };
}
