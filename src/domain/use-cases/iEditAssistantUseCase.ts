import { Assistant } from '../entities';
import { AssistantEditParams } from '../services';

export interface IEditAssistantUseCase {
    execute (request: EditAssistantParams): Promise<EditAssistantReturn>;
}

export type EditAssistantParams = {
    id: string;
    editParams: AssistantEditParams;
};

export type EditAssistantReturn = {
    assistant?: Assistant;
    success: boolean;
    error?: string;
};
