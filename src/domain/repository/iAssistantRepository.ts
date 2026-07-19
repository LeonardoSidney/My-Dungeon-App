import { Assistant } from '../entities';

export interface IAssistantRepository {
    saveAssistant (params: SaveAssistantParams): Promise<boolean>;
    getAssistants (): Promise<Assistant[]>;
    editAssistant (params: EditAssistantParams): Promise<EditAssistantReturn>;
    eraseAssistant (assistantId: string): Promise<EraseAssistantReturn>;
}

export type SaveAssistantParams = {
    assistant: Assistant;
};

export type EditAssistantParams = {
    assistant: Assistant;
};

export type EditAssistantReturn = {
    success: boolean;
    error?: string;
};

export type EraseAssistantReturn = {
    success: boolean;
    error?: string;
};
