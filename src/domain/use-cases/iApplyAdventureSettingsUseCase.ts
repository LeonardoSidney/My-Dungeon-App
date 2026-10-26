import type { SamplerParameters } from '@domain/entities';
import type { AdventureFormFields } from '@domain/services';

export interface IApplyAdventureSettingsUseCase {
    execute (params: ApplyAdventureSettingsParams): Promise<ApplyAdventureSettingsReturn>;
}

export type ApplyAdventureSettingsParams = {
    adventureId: string;
    adventure: AdventureFormFields;
    characterAssistants: Record<string, string>;
    worldMasterAssistants: Record<string, string>;
    assistantSamplers: Record<string, string>;
    samplerParameters: Record<string, SamplerParameters>;
};

export type ApplyAdventureSettingsReturn = {
    success: boolean;
    error?: string;
};

export type ApplyAdventureSettingsStepResult = string | null;

export type ApplyAdventureSettingsStepResponse = {
    success: boolean;
    error?: string;
};
