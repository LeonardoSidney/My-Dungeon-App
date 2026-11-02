import { formatEntityNotFound } from '@application/shared/formatEntityNotFound';
import { ASSISTANT_STORAGE_NAMESPACE, CHARACTER_STORAGE_NAMESPACE, SAMPLER_STORAGE_NAMESPACE, WORLD_MASTER_STORAGE_NAMESPACE } from '@domain/constants/general';
import { getAdaptiveRangeError } from '@application/shared/adaptiveSamplerRules';
import { SamplerActionEnum } from '@domain/constants/sampler';
import { Assistant, Character, Sampler, SamplerParameters, WorldMaster } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    ApplyAdventureSettingsLoadedEntity,
    ApplyAdventureSettingsLoadedGroup,
    ApplyAdventureSettingsLoadResult,
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

        const loaded = await this.loadEntities(params);
        if (!loaded.entities) {
            this.logger.warning('ApplyAdventureSettingsUseCase::execute - failed to load the entities', loaded.error);
            return { success: false, error: loaded.error };
        }

        const { characters, worldMasters, assistants, samplers } = loaded.entities;
        const samplerError = this.validateSamplerEdits(params.samplerParameters, samplers);
        if (samplerError) {
            return { success: false, error: samplerError };
        }

        const adventureResponse = await this.editAdventureUseCase.execute({ id: params.adventureId, editParams: params.adventure });
        if (!adventureResponse.success) {
            return { success: false, error: adventureResponse.error ?? 'Failed to save the adventure' };
        }

        const steps = [
            ...Object.entries(params.characterAssistants).map(([id, assistantId]) => () => this.applyCharacterAssistant(characters[id], assistantId)),
            ...Object.entries(params.worldMasterAssistants).map(([id, assistantId]) => () => this.applyWorldMasterAssistant(worldMasters[id], assistantId)),
            ...Object.entries(params.assistantSamplers).map(([id, samplerId]) => () => this.applyAssistantSampler(assistants[id], samplerId)),
            ...Object.entries(params.samplerParameters).map(([id, parameters]) => () => this.applySamplerParameters(samplers[id], parameters)),
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

    private async loadEntities (params: ApplyAdventureSettingsParams): Promise<ApplyAdventureSettingsLoadResult> {
        const { characterAssistants, worldMasterAssistants, assistantSamplers, samplerParameters } = params;

        const characters = await this.loadGroup(Object.keys(characterAssistants), id => this.loadCharacter(id));
        if (!characters.group) {
            return { error: characters.error };
        }

        const worldMasters = await this.loadGroup(Object.keys(worldMasterAssistants), id => this.loadWorldMaster(id));
        if (!worldMasters.group) {
            return { error: worldMasters.error };
        }

        const assistantIds = [...Object.keys(assistantSamplers), ...Object.values(characterAssistants), ...Object.values(worldMasterAssistants)];
        const assistants = await this.loadGroup(assistantIds, id => this.loadAssistant(id));
        if (!assistants.group) {
            return { error: assistants.error };
        }

        const samplerIds = [...Object.keys(samplerParameters), ...Object.values(assistantSamplers)];
        const samplers = await this.loadGroup(samplerIds, id => this.loadSampler(id));
        if (!samplers.group) {
            return { error: samplers.error };
        }

        return {
            entities: {
                characters: characters.group,
                worldMasters: worldMasters.group,
                assistants: assistants.group,
                samplers: samplers.group,
            },
        };
    }

    private async loadGroup<TEntity> (
        ids: string[],
        load: (id: string) => Promise<ApplyAdventureSettingsLoadedEntity<TEntity>>
    ): Promise<ApplyAdventureSettingsLoadedGroup<TEntity>> {
        const group: Record<string, TEntity> = {};

        for (const id of new Set(ids)) {
            const { entity, error } = await load(id);
            if (!entity) {
                return { error };
            }

            group[id] = entity;
        }

        return { group };
    }

    private async loadCharacter (id: string): Promise<ApplyAdventureSettingsLoadedEntity<Character>> {
        const response = await this.getCharacterByIdUseCase.execute({ id });
        if (!response.success || !response.character) {
            return { error: response.error ?? formatEntityNotFound(id, CHARACTER_STORAGE_NAMESPACE) };
        }

        return { entity: response.character };
    }

    private async loadWorldMaster (id: string): Promise<ApplyAdventureSettingsLoadedEntity<WorldMaster>> {
        const response = await this.getWorldMasterByIdUseCase.execute({ id });
        if (!response.success || !response.worldMaster) {
            return { error: response.error ?? formatEntityNotFound(id, WORLD_MASTER_STORAGE_NAMESPACE) };
        }

        return { entity: response.worldMaster };
    }

    private async loadAssistant (id: string): Promise<ApplyAdventureSettingsLoadedEntity<Assistant>> {
        const response = await this.getAssistantByIdUseCase.execute({ id });
        if (!response.success || !response.assistant) {
            return { error: response.error ?? formatEntityNotFound(id, ASSISTANT_STORAGE_NAMESPACE) };
        }

        return { entity: response.assistant };
    }

    private async loadSampler (id: string): Promise<ApplyAdventureSettingsLoadedEntity<Sampler>> {
        const response = await this.getSamplerByIdUseCase.execute({ id });
        if (!response.success || !response.sampler) {
            return { error: response.error ?? formatEntityNotFound(id, SAMPLER_STORAGE_NAMESPACE) };
        }

        return { entity: response.sampler };
    }

    private validateSamplerEdits (samplerParameters: Record<string, SamplerParameters>, samplers: Record<string, Sampler>): string | null {
        for (const [id, parameters] of Object.entries(samplerParameters)) {
            const sampler = samplers[id];
            if (sampler.systemDefault) {
                return `${sampler.name} is a system sampler and cannot be edited`;
            }

            const adaptiveError = getAdaptiveRangeError({ ...sampler, ...parameters }, SamplerActionEnum.EDIT);
            if (adaptiveError) {
                return adaptiveError;
            }
        }

        return null;
    }

    private async applyCharacterAssistant (character: Character, assistantId: string): Promise<ApplyAdventureSettingsStepResult> {
        const edited = await this.editCharacterUseCase.execute({
            id: character.id,
            editParams: { ...character, assistantId },
        });
        return this.toStepResult(edited, `Failed to update the assistant of ${character.name}`);
    }

    private async applyWorldMasterAssistant (worldMaster: WorldMaster, assistantId: string): Promise<ApplyAdventureSettingsStepResult> {
        const edited = await this.editWorldMasterUseCase.execute({
            id: worldMaster.id,
            editParams: { ...worldMaster, assistantId },
        });
        return this.toStepResult(edited, `Failed to update the assistant of ${worldMaster.name}`);
    }

    private async applyAssistantSampler (assistant: Assistant, samplerId: string): Promise<ApplyAdventureSettingsStepResult> {
        const edited = await this.editAssistantUseCase.execute({
            id: assistant.id,
            editParams: { ...assistant, samplerId },
        });
        return this.toStepResult(edited, `Failed to update the sampler of ${assistant.name}`);
    }

    private async applySamplerParameters (sampler: Sampler, parameters: SamplerParameters): Promise<ApplyAdventureSettingsStepResult> {
        const edited = await this.editSamplerUseCase.execute({
            id: sampler.id,
            editParams: { ...sampler, ...parameters },
        });
        return this.toStepResult(edited, `Failed to update the sampler ${sampler.name}`);
    }

    private toStepResult (response: ApplyAdventureSettingsStepResponse, fallback: string): ApplyAdventureSettingsStepResult {
        if (response.success) {
            return null;
        }
        return response.error ?? fallback;
    }
}
