import { Assistant } from '../entities';
import { AssistantEditParams } from '../services';

export interface IEditAssistantController {
    handle (params: EditAssistantControllerParams): Promise<EditAssistantControllerResponse>;
}

export type EditAssistantControllerParams = {
    id: string;
    editParams: AssistantEditParams;
};

export type EditAssistantControllerResponse = {
    success: boolean;
    assistant?: Assistant;
    error?: string;
};
