export interface IValidateSystemPromptLoadOrderService {
    validate (params: ValidateSystemPromptLoadOrderServiceParams): ValidateSystemPromptLoadOrderServiceReturn;
}

export type ValidateSystemPromptLoadOrderServiceParams = {
    loadOrder: string;
};

export type ValidateSystemPromptLoadOrderServiceReturn = {
    success: boolean;
    loadOrder?: string;
    error?: string;
};

export const LOAD_ORDER_WHITESPACE_PATTERN = /\s+/g;
export const LOAD_ORDER_TAG_PATTERN = /\{([^{}]*)\}/g;
