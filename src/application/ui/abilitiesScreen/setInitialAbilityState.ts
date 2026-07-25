import { AbilityFormData } from './constants';

export function setInitialAbilityState (): AbilityFormData {
    return {
        id: '',
        name: '',
        activationWorld: '',
        prompt: '',
        observation: '',
        createdAt: undefined,
        updatedAt: undefined,
    };
}
