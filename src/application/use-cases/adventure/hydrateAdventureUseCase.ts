import {
    Ability,
    Assistant,
    Character,
    Connection,
    Proficiency,
    Sampler,
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
import { IGetSamplersService } from '@domain/services';
import {
    HydrateAdventureParams,
    HydrateAdventureReturn,
    HydratedAdventure,
    HydratedCharacter,
    IHydrateAdventureUseCase,
} from '@domain/use-cases';
import { createSamplerResolver } from '@application/shared/resolveSampler';

export class HydrateAdventureUseCase implements IHydrateAdventureUseCase {
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

    async execute (params: HydrateAdventureParams): Promise<HydrateAdventureReturn> {
        this.logger.info('Executing HydrateAdventureUseCase::execute');
        const { adventure } = params;

        try {
            const characters = await this.resolveCharacters(adventure.characterIds);
            const worldMaster = adventure.worldMasterId
                ? await this.worldMasterRepository.getWorldMasterById(adventure.worldMasterId)
                : undefined;

            const assistants = await this.resolveAssistants(characters, worldMaster);
            const samplers = await this.resolveSamplers(assistants);
            const connections = await this.resolveConnections(assistants);
            const worlds = await this.resolveByIds(adventure.worldIds, (id) => this.worldRepository.getWorldById(id));
            const locations = await this.resolveByIds(adventure.locationIds, (id) => this.locationRepository.getLocationById(id));
            const items = await this.resolveByIds(adventure.itemIds, (id) => this.itemRepository.getItemById(id));
            const systemPrompts = await this.resolveByIds(adventure.systemPromptIds, (id) => this.systemPromptRepository.getSystemPromptById(id));

            const abilityIds = this.collectIds(characters, 'abilityIds');
            const proficiencyIds = this.collectIds(characters, 'proficiencyIds');
            const statusIds = this.collectIds(characters, 'statusIds');
            const abilities = await this.resolveByIds(abilityIds, (id) => this.abilityRepository.getAbilityById(id));
            const proficiencies = await this.resolveByIds(proficiencyIds, (id) => this.proficiencyRepository.getProficiencyById(id));
            const statuses = await this.resolveByIds(statusIds, (id) => this.statusRepository.getStatusById(id));

            const hydratedCharacters = characters.map((character) => this.buildHydratedCharacter(character, adventure.characterAsWorldMasterId, adventure.charactersControlledByAi, abilities, proficiencies, statuses));

            const hydrated: HydratedAdventure = {
                adventure,
                characters: hydratedCharacters,
                worldMaster,
                assistants,
                samplers,
                connections,
                worlds,
                locations,
                items,
                systemPrompts,
                abilities,
                proficiencies,
                statuses,
            };

            this.logger.debug('HydrateAdventureUseCase::execute - hydrated adventure built', {
                characterCount: characters.length,
                hasWorldMaster: Boolean(worldMaster),
                assistantCount: Object.keys(assistants).length,
            });

            return {
                success: true,
                hydrated,
            };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(`HydrateAdventureUseCase::execute failed: ${error.message}`);
                return {
                    success: false,
                    error: error.message,
                };
            }
            return {
                success: false,
                error: 'Unknown error while hydrating adventure',
            };
        }
    }

    private async resolveCharacters (characterIds: string[]): Promise<Character[]> {
        this.logger.debug(`Resolving ${characterIds.length} characters`);
        const characters = await this.resolveByIds(characterIds, (id) => this.characterRepository.getCharacterById(id));
        if (characters.length !== characterIds.length) {
            throw new Error(`Some characters were not found for adventure: ${characterIds.length - characters.length} orphan ids`);
        }
        return characters;
    }

    private async resolveAssistants (characters: Character[], worldMaster: WorldMaster | undefined): Promise<Record<string, Assistant>> {
        const assistantIds = this.uniqueIds(
            [
                ...characters.map((c) => c.assistantId),
                ...(worldMaster ? [worldMaster.assistantId] : []),
            ]
        );

        const assistants: Record<string, Assistant> = {};
        for (const assistantId of assistantIds) {
            const assistant = await this.assistantRepository.getAssistantById(assistantId);
            if (!assistant) {
                throw new Error(`Assistant not found: ${assistantId}`);
            }
            assistants[assistant.id] = assistant;
        }
        this.logger.debug(`Resolved ${assistantIds.length} assistants`);
        return assistants;
    }

    private async resolveSamplers (assistants: Record<string, Assistant>): Promise<Sampler[]> {
        const samplerIds = this.uniqueIds(Object.values(assistants).map((a) => a.samplerId));
        const resolveSampler = createSamplerResolver(this.samplerRepository, this.getSamplersService);
        return this.resolveByIds(samplerIds, resolveSampler);
    }

    private async resolveConnections (assistants: Record<string, Assistant>): Promise<Connection[]> {
        const connectionIds = this.uniqueIds(Object.values(assistants).map((a) => a.connectionId));
        return this.resolveByIds(connectionIds, (id) => this.connectionRepository.getConnectionById(id));
    }

    private async resolveByIds<T extends { id: string; }> (
        ids: string[],
        resolve: (id: string) => Promise<T | undefined>
    ): Promise<T[]> {
        const resolved: T[] = [];
        for (const id of ids) {
            const entity = await resolve(id);
            if (!entity) {
                throw new Error(`Entity not found for id: ${id}`);
            }
            resolved.push(entity);
        }
        return resolved;
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
