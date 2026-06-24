import { Assistant } from "../entities";

export interface IAssistantRepository {
    saveAssistant(params: SaveAssistantParams): Promise<boolean>;
    getAssistants(): Promise<Assistant[]>;
}

export type SaveAssistantParams = {
    assistant: Assistant;
};
