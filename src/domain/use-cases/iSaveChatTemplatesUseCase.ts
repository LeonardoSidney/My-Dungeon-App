import { ChatTemplateFieldErrors, ChatTemplateOverrides } from '@domain/entities';

export interface ISaveChatTemplatesUseCase {
    execute (params: SaveChatTemplatesUseCaseParams): Promise<SaveChatTemplatesUseCaseReturn>;
}

export type SaveChatTemplatesUseCaseParams = {
    templates: ChatTemplateOverrides;
};

export type SaveChatTemplatesUseCaseReturn = {
    success: boolean;
    fieldErrors?: ChatTemplateFieldErrors;
    error?: string;
};
