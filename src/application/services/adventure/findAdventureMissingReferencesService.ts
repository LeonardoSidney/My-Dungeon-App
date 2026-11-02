import {
    Adventure,
    Assistant,
    Character,
    MissingReference,
    MissingReferenceKindEnum,
    MissingReferenceOwnerEnum,
    WorldMaster,
} from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IAbilityRepository,
    IAssistantRepository,
    ICharacterRepository,
    IConnectionRepository,
    IItemRepository,
    ILocationRepository,
    IProficiencyRepository,
    ISamplerRepository,
    IStatusRepository,
    ISystemPromptRepository,
    IWorldMasterRepository,
    IWorldRepository,
} from '@domain/repository';
import {
    FindAdventureMissingReferencesParams,
    FindAdventureMissingReferencesResponse,
    IFindAdventureMissingReferencesService,
    IGetSamplersService,
    ReferenceCheck,
    ReferenceLookup,
    ReferenceOwner,
    ResolvedEntities,
} from '@domain/services';
import { createSamplerResolver } from '@application/shared/resolveSampler';

export class FindAdventureMissingReferencesService implements IFindAdventureMissingReferencesService {
    constructor (
        private readonly logger: ILogger,
        private readonly characterRepository: ICharacterRepository,
        private readonly worldMasterRepository: IWorldMasterRepository,
        private readonly assistantRepository: IAssistantRepository,
        private readonly connectionRepository: IConnectionRepository,
        private readonly samplerRepository: ISamplerRepository,
        private readonly getSamplersService: IGetSamplersService,
        private readonly worldRepository: IWorldRepository,
        private readonly locationRepository: ILocationRepository,
        private readonly itemRepository: IItemRepository,
        private readonly systemPromptRepository: ISystemPromptRepository,
        private readonly abilityRepository: IAbilityRepository,
        private readonly proficiencyRepository: IProficiencyRepository,
        private readonly statusRepository: IStatusRepository
    ) { }

    async find (params: FindAdventureMissingReferencesParams): Promise<FindAdventureMissingReferencesResponse> {
        this.logger.info('Execute FindAdventureMissingReferencesService::find');
        const { adventure } = params;

        const characters = await this.loadExisting(adventure.characterIds, (id) => this.characterRepository.getCharacterById(id), (r) => r.character);
        if (!characters.success || !characters.entities) {
            return { success: false, error: characters.error };
        }

        const worldMasterIds = this.toIds(adventure.worldMasterId);
        const worldMasters = await this.loadExisting(worldMasterIds, (id) => this.worldMasterRepository.getWorldMasterById(id), (r) => r.worldMaster);
        if (!worldMasters.success || !worldMasters.entities) {
            return { success: false, error: worldMasters.error };
        }

        const voices = [...characters.entities, ...worldMasters.entities];
        const assistantIds = [...new Set(voices.map((voice) => voice.assistantId))];
        const assistants = await this.loadExisting(assistantIds, (id) => this.assistantRepository.getAssistantById(id), (r) => r.assistant);
        if (!assistants.success || !assistants.entities) {
            return { success: false, error: assistants.error };
        }

        return this.runChecks([
            ...this.buildAdventureChecks(adventure),
            ...characters.entities.flatMap((character) => this.buildCharacterChecks(character)),
            ...worldMasters.entities.map((worldMaster) => this.buildWorldMasterCheck(worldMaster)),
            ...assistants.entities.flatMap((assistant) => this.buildAssistantChecks(assistant)),
        ]);
    }

    private async runChecks (checks: ReferenceCheck[]): Promise<FindAdventureMissingReferencesResponse> {
        const missingReferences: MissingReference[] = [];

        for (const { owner, ownerName, kind, ids, lookup } of checks) {
            for (const id of ids) {
                const result = await lookup(id);
                if (!result.success) {
                    this.logger.warning(`FindAdventureMissingReferencesService::find - failed to resolve ${kind}`, result.error);
                    return { success: false, error: result.error ?? `Failed to resolve ${kind}` };
                }

                if (!result.exists) {
                    missingReferences.push({ owner, ownerName, kind, id });
                }
            }
        }

        this.logger.debug('FindAdventureMissingReferencesService::find - missing references', missingReferences);
        return { success: true, missingReferences };
    }

    private buildAdventureChecks (adventure: Adventure): ReferenceCheck[] {
        const owner: ReferenceOwner = { owner: MissingReferenceOwnerEnum.ADVENTURE, ownerName: adventure.name };

        return [
            { ...owner, kind: MissingReferenceKindEnum.CHARACTER, ids: adventure.characterIds, lookup: this.toLookup((id) => this.characterRepository.getCharacterById(id), (r) => r.character) },
            { ...owner, kind: MissingReferenceKindEnum.WORLD_MASTER, ids: this.toIds(adventure.worldMasterId), lookup: this.toLookup((id) => this.worldMasterRepository.getWorldMasterById(id), (r) => r.worldMaster) },
            { ...owner, kind: MissingReferenceKindEnum.SYSTEM_PROMPT, ids: adventure.systemPromptIds, lookup: this.toLookup((id) => this.systemPromptRepository.getSystemPromptById(id), (r) => r.systemPrompt) },
            { ...owner, kind: MissingReferenceKindEnum.WORLD, ids: adventure.worldIds, lookup: this.toLookup((id) => this.worldRepository.getWorldById(id), (r) => r.world) },
            { ...owner, kind: MissingReferenceKindEnum.LOCATION, ids: adventure.locationIds, lookup: this.toLookup((id) => this.locationRepository.getLocationById(id), (r) => r.location) },
            { ...owner, kind: MissingReferenceKindEnum.ITEM, ids: adventure.itemIds, lookup: this.toLookup((id) => this.itemRepository.getItemById(id), (r) => r.item) },
        ];
    }

    private buildCharacterChecks (character: Character): ReferenceCheck[] {
        const owner: ReferenceOwner = { owner: MissingReferenceOwnerEnum.CHARACTER, ownerName: character.name };

        return [
            { ...owner, kind: MissingReferenceKindEnum.ASSISTANT, ids: [character.assistantId], lookup: this.assistantLookup() },
            { ...owner, kind: MissingReferenceKindEnum.ABILITY, ids: character.abilityIds ?? [], lookup: this.toLookup((id) => this.abilityRepository.getAbilityById(id), (r) => r.ability) },
            { ...owner, kind: MissingReferenceKindEnum.PROFICIENCY, ids: character.proficiencyIds ?? [], lookup: this.toLookup((id) => this.proficiencyRepository.getProficiencyById(id), (r) => r.proficiency) },
            { ...owner, kind: MissingReferenceKindEnum.STATUS, ids: character.statusIds ?? [], lookup: this.toLookup((id) => this.statusRepository.getStatusById(id), (r) => r.status) },
        ];
    }

    private buildWorldMasterCheck (worldMaster: WorldMaster): ReferenceCheck {
        return {
            owner: MissingReferenceOwnerEnum.WORLD_MASTER,
            ownerName: worldMaster.name,
            kind: MissingReferenceKindEnum.ASSISTANT,
            ids: [worldMaster.assistantId],
            lookup: this.assistantLookup(),
        };
    }

    private buildAssistantChecks (assistant: Assistant): ReferenceCheck[] {
        const owner: ReferenceOwner = { owner: MissingReferenceOwnerEnum.ASSISTANT, ownerName: assistant.name };
        const resolveSampler = createSamplerResolver(this.samplerRepository, this.getSamplersService);

        return [
            { ...owner, kind: MissingReferenceKindEnum.SAMPLER, ids: [assistant.samplerId], lookup: this.toLookup(resolveSampler, (r) => r.sampler) },
            { ...owner, kind: MissingReferenceKindEnum.CONNECTION, ids: [assistant.connectionId], lookup: this.toLookup((id) => this.connectionRepository.getConnectionById(id), (r) => r.connection) },
        ];
    }

    private assistantLookup (): ReferenceCheck['lookup'] {
        return this.toLookup((id) => this.assistantRepository.getAssistantById(id), (r) => r.assistant);
    }

    private toLookup<TResponse extends { success: boolean; error?: string; }> (
        resolve: (id: string) => Promise<TResponse>,
        select: (response: TResponse) => unknown
    ): (id: string) => Promise<ReferenceLookup> {
        return async (id) => {
            const response = await resolve(id);
            if (!response.success) {
                return { success: false, error: response.error };
            }

            return { success: true, exists: Boolean(select(response)) };
        };
    }

    private async loadExisting<TResponse extends { success: boolean; error?: string; }, TEntity> (
        ids: string[],
        resolve: (id: string) => Promise<TResponse>,
        select: (response: TResponse) => TEntity | undefined
    ): Promise<ResolvedEntities<TEntity>> {
        const entities: TEntity[] = [];
        for (const id of ids) {
            const response = await resolve(id);
            if (!response.success) {
                return { success: false, error: response.error };
            }

            const entity = select(response);
            if (entity) {
                entities.push(entity);
            }
        }

        return { success: true, entities };
    }

    private toIds (id: string | undefined): string[] {
        return id ? [id] : [];
    }
}
