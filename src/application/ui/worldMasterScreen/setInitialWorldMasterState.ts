import { WorldMasterFormData } from './constants';

export function setInitialWorldMasterState (): WorldMasterFormData {
    return {
        id: undefined,
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
        assistant: null,
    };
}
