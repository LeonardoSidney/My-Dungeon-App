import { ProficiencyFormData } from './constants';

export function setInitialProficiencyState (): ProficiencyFormData {
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
