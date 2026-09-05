import { LocationFormData } from './constants';

export function setInitialLocationState (): LocationFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    };
}
