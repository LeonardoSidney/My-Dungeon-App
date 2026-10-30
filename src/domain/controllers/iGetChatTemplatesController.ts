import { ChatTemplateDefinitions, ChatTemplates } from '@domain/entities';

export interface IGetChatTemplatesController {
    handle (): Promise<GetChatTemplatesControllerResponse>;
}

export type GetChatTemplatesControllerResponse = {
    success: boolean;
    templates?: ChatTemplates;
    definitions?: ChatTemplateDefinitions;
    error?: string;
};
