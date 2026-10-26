import { SamplerParameters } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    ApplyAdventureSettingsParams,
    ApplyAdventureSettingsReturn,
    ApplyAdventureSettingsStepResponse,
    ApplyAdventureSettingsStepResult,
    IApplyAdventureSettingsUseCase,
    IEditAdventureUseCase,
    IEditAssistantUseCase,
    IEditCharacterUseCase,
    IEditSamplerUseCase,
    IEditWorldMasterUseCase,
    IGetAssistantByIdUseCase,
    IGetCharacterByIdUseCase,
    IGetSamplerByIdUseCase,
    IGetWorldMasterByIdUseCase,
} from '@domain/use-cases';

export class ApplyAdventureSettingsUseCase implements IApplyAdventureSettingsUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly editAdventureUseCase: IEditAdventureUseCase,
        private readonly getCharacterByIdUseCase: IGetCharacterByIdUseCase,
        private readonly editCharacterUseCase: IEditCharacterUseCase,
        private readonly getWorldMasterByIdUseCase: IGetWorldMasterByIdUseCase,
        private readonly editWorldMasterUseCase: IEditWorldMasterUseCase,
        private readonly getAssistantByIdUseCase: IGetAssistantByIdUseCase,
        private readonly editAssistantUseCase: IEditAssistantUseCase,
        private readonly getSamplerByIdUseCase: IGetSamplerByIdUseCase,
        private readonly editSamplerUseCase: IEditSamplerUseCase
    ) { }

    async execute (params: ApplyAdventureSettingsParams): Promise<ApplyAdventureSettingsReturn> {
        this.logger.info('Executing ApplyAdventureSettingsUseCase::execute');
        this.logger.debug('ApplyAdventureSettingsUseCase::execute - params', params);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.editAdventureUseCase.execute({ id: params.adventureId, editParams: params.adventure });
        if (!adventureResponse.success) {
            return { success: false, error: adventureResponse.error ?? 'Failed to save the adventure' };
        }

        const steps = [
            ...Object.entries(params.characterAssistants).map(([id, assistantId]) => () => this.applyCharacterAssistant(id, assistantId)),
            ...Object.entries(params.worldMasterAssistants).map(([id, assistantId]) => () => this.applyWorldMasterAssistant(id, assistantId)),
            ...Object.entries(params.assistantSamplers).map(([id, samplerId]) => () => this.applyAssistantSampler(id, samplerId)),
            ...Object.entries(params.samplerParameters).map(([id, parameters]) => () => this.applySamplerParameters(id, parameters)),
        ];

        for (const step of steps) {
            const error = await step();
            if (error) {
                this.logger.warning('ApplyAdventureSettingsUseCase::execute - step failed', error);
                return { success: false, error };
            }
        }

        return { success: true };
    }

    private validate (params: ApplyAdventureSettingsParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }

    private async applyCharacterAssistant (characterId: string, assistantId: string): Promise<ApplyAdventureSettingsStepResult> {
        const response = await this.getCharacterByIdUseCase.execute({ id: characterId });
        if (!response.success || !response.character) {
            return response.error ?? `Character not found: ${characterId}`;
        }

        const edited = await this.editCharacterUseCase.execute({
            id: characterId,
            editParams: { ...response.character, assistantId },
        });
        return this.toStepResult(edited, `Failed to update the assistant of ${response.character.name}`);
    }

    private async applyWorldMasterAssistant (worldMasterId: string, assistantId: string): Promise<ApplyAdventureSettingsStepResult> {
        const response = await this.getWorldMasterByIdUseCase.execute({ id: worldMasterId });
        if (!response.success || !response.worldMaster) {
            return response.error ?? `World master not found: ${worldMasterId}`;
        }

        const edited = await this.editWorldMasterUseCase.execute({
            id: worldMasterId,
            editParams: { ...response.worldMaster, assistantId },
        });
        return this.toStepResult(edited, `Failed to update the assistant of ${response.worldMaster.name}`);
    }

    private async applyAssistantSampler (assistantId: string, samplerId: string): Promise<ApplyAdventureSettingsStepResult> {
        const response = await this.getAssistantByIdUseCase.execute({ id: assistantId });
        if (!response.success || !response.assistant) {
            return response.error ?? `Assistant not found: ${assistantId}`;
        }

        const edited = await this.editAssistantUseCase.execute({
            id: assistantId,
            editParams: { ...response.assistant, samplerId },
        });
        return this.toStepResult(edited, `Failed to update the sampler of ${response.assistant.name}`);
    }

    private async applySamplerParameters (samplerId: string, parameters: SamplerParameters): Promise<ApplyAdventureSettingsStepResult> {
        const response = await this.getSamplerByIdUseCase.execute({ id: samplerId });
        if (!response.success || !response.sampler) {
            return response.error ?? `Sampler not found: ${samplerId}`;
        }

        if (response.sampler.systemDefault) {
            return `${response.sampler.name} is a system sampler and cannot be edited`;
        }

        const edited = await this.editSamplerUseCase.execute({
            id: samplerId,
            editParams: { ...response.sampler, ...parameters },
        });
        return this.toStepResult(edited, `Failed to update the sampler ${response.sampler.name}`);
    }

    private toStepResult (response: ApplyAdventureSettingsStepResponse, fallback: string): ApplyAdventureSettingsStepResult {
        if (response.success) {
            return null;
        }
        return response.error ?? fallback;
    }
}
