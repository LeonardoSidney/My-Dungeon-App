import { SamplerParameters } from '@domain/entities';
import { AdventureFormRequest } from '@domain/controllers/iCreateAdventureController';

export interface IApplyAdventureSettingsController {
    handle (params: ApplyAdventureSettingsControllerParams): Promise<ApplyAdventureSettingsControllerResponse>;
}

export type ApplyAdventureSettingsControllerParams = {
    adventureId: string;
    adventure: AdventureFormRequest;
    characterAssistants: Record<string, string>;
    worldMasterAssistants: Record<string, string>;
    assistantSamplers: Record<string, string>;
    samplerParameters: Record<string, SamplerParameters>;
};

export type ApplyAdventureSettingsControllerResponse = {
    success: boolean;
    error?: string;
};
