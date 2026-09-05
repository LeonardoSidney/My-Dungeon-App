import { SystemPromptFormData } from './constants';

export function setInitialSystemPromptState (): SystemPromptFormData {
    return {
        id: '',
        name: '',
        content: '',
        observation: '',
    };
}
