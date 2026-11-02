import { REFERENCED_ENTITIES } from '@domain/constants/referencedEntities';
import { Adventure, Character } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IHydrateAdventureService, IValidateUniqueIdsService, UniqueIdList } from '@domain/services';
import {
    HydrateAdventureParams,
    HydrateAdventureReturn,
    IHydrateAdventureUseCase,
} from '@domain/use-cases';

export class HydrateAdventureUseCase implements IHydrateAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository,
        private readonly hydrateAdventureService: IHydrateAdventureService,
        private readonly validateUniqueIdsService: IValidateUniqueIdsService
    ) { }

    async execute (params: HydrateAdventureParams): Promise<HydrateAdventureReturn> {
        this.logger.info('Executing HydrateAdventureUseCase::execute');
        this.logger.debug('Executing HydrateAdventureUseCase::execute - params', params);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('HydrateAdventureUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error ?? 'Failed to load adventure' };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return {
                success: false,
                error: `Adventure with id ${params.adventureId} not found`,
            };
        }

        const adventureIdsResponse = this.validateUniqueIdsService.validate({ idLists: this.buildAdventureIdLists(adventure) });
        if (!adventureIdsResponse.success) {
            return { success: false, error: adventureIdsResponse.error };
        }

        const response = await this.hydrateAdventureService.hydrate({ adventure });

        if (!response.success) {
            this.logger.warning('HydrateAdventureUseCase::execute - hydration failed', response.error);
            return {
                success: false,
                error: response.error ?? 'Failed to hydrate adventure',
            };
        }

        if (!response.hydrated) {
            return {
                success: false,
                error: 'Success is true but does not have a hydrated adventure',
            };
        }

        const characterIdsResponse = this.validateUniqueIdsService.validate({ idLists: this.buildCharacterIdLists(response.hydrated.characters) });
        if (!characterIdsResponse.success) {
            return { success: false, error: characterIdsResponse.error };
        }

        return {
            success: true,
            hydrated: response.hydrated,
        };
    }

    private validate (params: HydrateAdventureParams): string | null {
        if (!params.adventureId.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }

    private buildAdventureIdLists (adventure: Adventure): UniqueIdList[] {
        return [
            { collection: REFERENCED_ENTITIES.CHARACTER.collection, ids: adventure.characterIds },
            { collection: REFERENCED_ENTITIES.CHARACTER.collection, ids: adventure.charactersControlledByAi },
            { collection: REFERENCED_ENTITIES.SYSTEM_PROMPT.collection, ids: adventure.systemPromptIds },
            { collection: REFERENCED_ENTITIES.WORLD.collection, ids: adventure.worldIds },
            { collection: REFERENCED_ENTITIES.LOCATION.collection, ids: adventure.locationIds },
            { collection: REFERENCED_ENTITIES.ITEM.collection, ids: adventure.itemIds },
        ];
    }

    private buildCharacterIdLists (characters: Character[]): UniqueIdList[] {
        return characters.flatMap((character) => [
            { collection: REFERENCED_ENTITIES.ABILITY.collection, ids: character.abilityIds },
            { collection: REFERENCED_ENTITIES.PROFICIENCY.collection, ids: character.proficiencyIds },
            { collection: REFERENCED_ENTITIES.STATUS.collection, ids: character.statusIds },
        ]);
    }
}
