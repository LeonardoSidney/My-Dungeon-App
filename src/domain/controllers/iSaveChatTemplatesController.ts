import { ChatTemplateFieldErrors, ChatTemplateOverrides } from '@domain/entities';

export interface ISaveChatTemplatesController {
    handle (request: SaveChatTemplatesControllerRequest): Promise<SaveChatTemplatesControllerResponse>;
}

export type SaveChatTemplatesControllerRequest = {
    templates: ChatTemplateOverrides;
};

export type SaveChatTemplatesControllerResponse = {
    success: boolean;
    fieldErrors?: ChatTemplateFieldErrors;
    error?: string;
};
