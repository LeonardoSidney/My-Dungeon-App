import { ItemFormData } from './constants';

export function setInitialItemState (): ItemFormData {
    return {
        id: '',
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    };
}
