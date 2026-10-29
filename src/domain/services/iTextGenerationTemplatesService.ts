export interface ITextGenerationTemplatesService {
    getSystemPromptTemplate (): SystemPromptTemplateServiceResponse;
    getWorldMasterTemplate (): WorldMasterTemplateServiceResponse;
    getIaControlledCharacterTemplate (): IaControlledCharacterTemplateServiceResponse;
    getWorldsTemplate (): WorldsTemplateServiceResponse;
    getLocationsTemplate (): LocationsTemplateServiceResponse;
    getItemsTemplate (): ItemsTemplateServiceResponse;
    getAbilitiesTemplate (): AbilitiesTemplateServiceResponse;
    getProficienciesTemplate (): ProficienciesTemplateServiceResponse;
    getStatusesTemplate (): StatusesTemplateServiceResponse;
    getCharactersTemplate (): CharactersTemplateServiceResponse;
    getMessageTemplate (): MessageTemplateServiceResponse;
    getContextMessageTemplate (): ContextMessageTemplateServiceResponse;
    getTurnMessageTemplate (): TurnMessageTemplateServiceResponse;
    getCharacterMessageTemplate (): CharacterMessageTemplateServiceResponse;
    getInstructionsMessageTemplate (): InstructionsMessageTemplateServiceResponse;
    getAiCharacterInstructionTemplate (): AiCharacterInstructionTemplateServiceResponse;
    getWorldMasterInstructionTemplate (): WorldMasterInstructionTemplateServiceResponse;
    getContextInstructionTemplate (): ContextInstructionTemplateServiceResponse;
}

export type SystemPromptTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type WorldMasterTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type IaControlledCharacterTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type WorldsTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type LocationsTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type ItemsTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type AbilitiesTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type ProficienciesTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type StatusesTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type CharactersTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type MessageTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type ContextMessageTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type TurnMessageTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type CharacterMessageTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type InstructionsMessageTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type AiCharacterInstructionTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type WorldMasterInstructionTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
export type ContextInstructionTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
