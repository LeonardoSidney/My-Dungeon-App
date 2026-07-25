import { StatusFormData } from './constants';

export function setInitialStatusState (): StatusFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
        createdAt: undefined,
        updatedAt: undefined,
    };
}
