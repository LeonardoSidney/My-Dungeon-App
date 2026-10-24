import {
    Ability,
    Assistant,
    Character,
    Proficiency,
    Status,
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
import { IGetSamplersService, ResolvedAssistants, ResolvedEntities } from '@domain/services';
import {
    HydrateAdventureServiceParams,
    HydrateAdventureServiceResponse,
    HydratedAdventure,
    HydratedCharacter,
    IHydrateAdventureService,
} from '@domain/services';
import { createSamplerResolver } from '@application/shared/resolveSampler';

export class HydrateAdventureService implements IHydrateAdventureService {
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

    async hydrate (params: HydrateAdventureServiceParams): Promise<HydrateAdventureServiceResponse> {
        this.logger.info('Execute HydrateAdventureService::hydrate');
        const { adventure } = params;

        const characters = await this.resolveByIds(adventure.characterIds, (id) => this.characterRepository.getCharacterById(id), (r) => r.character);
        if (!characters.success || !characters.entities) {
            return this.fail('characters', characters.error);
        }

        let worldMaster: WorldMaster | undefined;
        if (adventure.worldMasterId) {
            const worldMasterResponse = await this.worldMasterRepository.getWorldMasterById(adventure.worldMasterId);
            if (!worldMasterResponse.success) {
                return this.fail('world master', worldMasterResponse.error);
            }
            worldMaster = worldMasterResponse.worldMaster;
        }

        const assistants = await this.resolveAssistants(characters.entities, worldMaster);
        if (!assistants.success || !assistants.assistants) {
            return this.fail('assistants', assistants.error);
        }

        const samplerIds = this.uniqueIds(Object.values(assistants.assistants).map((a) => a.samplerId));
        const samplers = await this.resolveByIds(samplerIds, createSamplerResolver(this.samplerRepository, this.getSamplersService), (r) => r.sampler);
        if (!samplers.success || !samplers.entities) {
            return this.fail('samplers', samplers.error);
        }

        const connectionIds = this.uniqueIds(Object.values(assistants.assistants).map((a) => a.connectionId));
        const connections = await this.resolveByIds(connectionIds, (id) => this.connectionRepository.getConnectionById(id), (r) => r.connection);
        if (!connections.success || !connections.entities) {
            return this.fail('connections', connections.error);
        }

        const worlds = await this.resolveByIds(adventure.worldIds, (id) => this.worldRepository.getWorldById(id), (r) => r.world);
        if (!worlds.success || !worlds.entities) {
            return this.fail('worlds', worlds.error);
        }

        const locations = await this.resolveByIds(adventure.locationIds, (id) => this.locationRepository.getLocationById(id), (r) => r.location);
        if (!locations.success || !locations.entities) {
            return this.fail('locations', locations.error);
        }

        const items = await this.resolveByIds(adventure.itemIds, (id) => this.itemRepository.getItemById(id), (r) => r.item);
        if (!items.success || !items.entities) {
            return this.fail('items', items.error);
        }

        const systemPrompts = await this.resolveByIds(adventure.systemPromptIds, (id) => this.systemPromptRepository.getSystemPromptById(id), (r) => r.systemPrompt);
        if (!systemPrompts.success || !systemPrompts.entities) {
            return this.fail('system prompts', systemPrompts.error);
        }

        const abilityIds = this.collectIds(characters.entities, 'abilityIds');
        const abilities = await this.resolveByIds(abilityIds, (id) => this.abilityRepository.getAbilityById(id), (r) => r.ability);
        if (!abilities.success || !abilities.entities) {
            return this.fail('abilities', abilities.error);
        }

        const proficiencyIds = this.collectIds(characters.entities, 'proficiencyIds');
        const proficiencies = await this.resolveByIds(proficiencyIds, (id) => this.proficiencyRepository.getProficiencyById(id), (r) => r.proficiency);
        if (!proficiencies.success || !proficiencies.entities) {
            return this.fail('proficiencies', proficiencies.error);
        }

        const statusIds = this.collectIds(characters.entities, 'statusIds');
        const statuses = await this.resolveByIds(statusIds, (id) => this.statusRepository.getStatusById(id), (r) => r.status);
        if (!statuses.success || !statuses.entities) {
            return this.fail('statuses', statuses.error);
        }

        const resolvedAbilities = abilities.entities;
        const resolvedProficiencies = proficiencies.entities;
        const resolvedStatuses = statuses.entities;
        const hydratedCharacters = characters.entities.map((character) => this.buildHydratedCharacter(
            character,
            adventure.characterAsWorldMasterId,
            adventure.charactersControlledByAi,
            resolvedAbilities,
            resolvedProficiencies,
            resolvedStatuses
        ));

        const hydrated: HydratedAdventure = {
            adventure,
            characters: hydratedCharacters,
            worldMaster,
            assistants: assistants.assistants,
            samplers: samplers.entities,
            connections: connections.entities,
            worlds: worlds.entities,
            locations: locations.entities,
            items: items.entities,
            systemPrompts: systemPrompts.entities,
            abilities: abilities.entities,
            proficiencies: proficiencies.entities,
            statuses: statuses.entities,
        };

        this.logger.debug('HydrateAdventureService::hydrate - hydrated adventure built', {
            characterCount: characters.entities.length,
            hasWorldMaster: Boolean(worldMaster),
            assistantCount: Object.keys(assistants.assistants).length,
        });

        return {
            success: true,
            hydrated,
        };
    }

    private fail (resource: string, error: string | undefined): HydrateAdventureServiceResponse {
        this.logger.warning(`HydrateAdventureService::hydrate - failed to resolve ${resource}`, error);
        return {
            success: false,
            error: error ?? `Failed to resolve ${resource}`,
        };
    }

    private async resolveAssistants (characters: Character[], worldMaster: WorldMaster | undefined): Promise<ResolvedAssistants> {
        const assistantIds = this.uniqueIds(
            [
                ...characters.map((c) => c.assistantId),
                ...(worldMaster ? [worldMaster.assistantId] : []),
            ]
        );

        const assistants: Record<string, Assistant> = {};
        for (const assistantId of assistantIds) {
            const response = await this.assistantRepository.getAssistantById(assistantId);
            if (!response.success) {
                return { success: false, error: response.error };
            }

            if (!response.assistant) {
                return { success: false, error: `Assistant not found: ${assistantId}` };
            }

            assistants[response.assistant.id] = response.assistant;
        }

        this.logger.debug(`Resolved ${assistantIds.length} assistants`);
        return { success: true, assistants };
    }

    private async resolveByIds<TResponse extends { success: boolean; error?: string; }, TEntity> (
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
            if (!entity) {
                return { success: false, error: `Entity not found for id: ${id}` };
            }

            entities.push(entity);
        }

        return { success: true, entities };
    }

    private collectIds (characters: Character[], field: 'abilityIds' | 'proficiencyIds' | 'statusIds'): string[] {
        return this.uniqueIds(characters.flatMap((c) => c[field] ?? []));
    }

    private uniqueIds (ids: string[]): string[] {
        return [...new Set(ids)];
    }

    private buildHydratedCharacter (
        character: Character,
        characterAsWorldMasterId: string | undefined,
        charactersControlledByAi: string[],
        abilities: Ability[],
        proficiencies: Proficiency[],
        statuses: Status[]
    ): HydratedCharacter {
        const characterAbilities = abilities.filter((a) => character.abilityIds?.includes(a.id));
        const characterProficiencies = proficiencies.filter((p) => character.proficiencyIds?.includes(p.id));
        const characterStatuses = statuses.filter((s) => character.statusIds?.includes(s.id));

        return {
            ...character,
            abilities: characterAbilities,
            proficiencies: characterProficiencies,
            statuses: characterStatuses,
            worldMaster: characterAsWorldMasterId === character.id,
            aiControlled: charactersControlledByAi.includes(character.id),
        };
    }
}
