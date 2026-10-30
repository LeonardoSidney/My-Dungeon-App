import { ChatTemplateFieldErrors, ChatTemplateOverrides } from '@domain/entities';

export interface IValidateChatTemplatesService {
    validate (params: ValidateChatTemplatesServiceParams): ValidateChatTemplatesServiceReturn;
}

export type ValidateChatTemplatesServiceParams = {
    templates: ChatTemplateOverrides;
};

export type ValidateChatTemplatesServiceReturn = {
    success: boolean;
    fieldErrors?: ChatTemplateFieldErrors;
};
