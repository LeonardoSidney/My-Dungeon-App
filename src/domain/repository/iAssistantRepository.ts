import { Assistant } from '../entities';

export interface IAssistantRepository {
    saveAssistant (params: SaveAssistantParams): Promise<SaveAssistantRepositoryReturn>;
    getAssistants (): Promise<GetAssistantsRepositoryReturn>;
    getAssistantById (assistantId: string): Promise<GetAssistantByIdRepositoryReturn>;
    editAssistant (params: EditAssistantParams): Promise<EditAssistantReturn>;
    eraseAssistant (assistantId: string): Promise<EraseAssistantReturn>;
}

export type SaveAssistantParams = {
    assistant: Assistant;
};

export type EditAssistantParams = {
    assistant: Assistant;
};

export type SaveAssistantRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetAssistantsRepositoryReturn = {
    success: boolean;
    assistants?: Assistant[];
    error?: string;
};

export type GetAssistantByIdRepositoryReturn = {
    success: boolean;
    assistant?: Assistant;
    error?: string;
};

export type EditAssistantReturn = {
    success: boolean;
    error?: string;
};

export type EraseAssistantReturn = {
    success: boolean;
    error?: string;
};
