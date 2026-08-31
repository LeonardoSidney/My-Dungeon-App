export interface ITextGenerationTemplatesService {
    getRootTemplate (): RootTemplateServiceResponse;
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
}

export type RootTemplateServiceResponse = { success: boolean; template?: string; error?: string; };
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
