import { ChatTemplateDefinitions, ChatTemplates } from '@domain/entities';

export interface IGetChatTemplatesUseCase {
    execute (): Promise<GetChatTemplatesUseCaseReturn>;
}

export type GetChatTemplatesUseCaseReturn = {
    success: boolean;
    templates?: ChatTemplates;
    definitions?: ChatTemplateDefinitions;
    error?: string;
};
