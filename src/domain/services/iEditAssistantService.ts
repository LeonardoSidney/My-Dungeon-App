import { Assistant } from '../entities';

export type AssistantEditParams = Omit<Assistant, 'id' | 'createdAt' | 'updatedAt'>;

export interface IEditAssistantService {
    editAssistant (request: EditAssistantServiceParams): EditAssistantServiceReturn;
}

export type EditAssistantServiceParams = {
    assistant: Assistant;
    editParams: AssistantEditParams;
};

export type EditAssistantServiceReturn = {
    success: boolean;
    assistant?: Assistant;
    error?: string;
};
