import { ILogger } from '@domain/logger';
import {
    IAdventureRepository,
    ICharacterRepository,
    IItemRepository,
    ILocationRepository,
    ISystemPromptRepository,
    IWorldRepository,
    IWorldMasterRepository,
} from '@domain/repository';
import {
    ICreateAdventureService,
    IValidateAdventureCharacterSelectionService,
    IValidateUniqueIdsService,
    UniqueIdList,
} from '@domain/services';
import { Adventure } from '@domain/entities';
import { CreateAdventureCaseParams, CreateAdventureCaseReturn, ICreateAdventureUseCase } from '@domain/use-cases';
import { MINIMUM_NUMBER_SYSTEM_PROMPT } from '@domain/constants/adventure';
import { REFERENCED_ENTITIES } from '@domain/constants/referencedEntities';
import { checkReferencedId, checkReferencedIds } from '@application/shared/validateReferencedIds';

export class CreateAdventureUseCase implements ICreateAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: ICreateAdventureService,
        private readonly validateAdventureCharacterSelectionService: IValidateAdventureCharacterSelectionService,
        private readonly validateUniqueIdsService: IValidateUniqueIdsService,
        private readonly adventureRepository: IAdventureRepository,
        private readonly characterRepository: ICharacterRepository,
        private readonly systemPromptRepository: ISystemPromptRepository,
        private readonly worldRepository: IWorldRepository,
        private readonly locationRepository: ILocationRepository,
        private readonly itemRepository: IItemRepository,
        private readonly worldMasterRepository: IWorldMasterRepository
    ) { }

    async execute (params: CreateAdventureCaseParams): Promise<CreateAdventureCaseReturn> {
        this.logger.info('Executing CreateAdventureUseCase::execute', params);
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }

        const uniqueIdsResponse = this.validateUniqueIdsService.validate({ idLists: this.buildIdLists(params) });
        if (!uniqueIdsResponse.success) {
            return {
                success: false,
                error: uniqueIdsResponse.error
            };
        }

        this.logger.debug('Calling CreateAdventureService::createAdventure', params);
        const response = this.service.createAdventure(params);
        this.logger.debug('CreateAdventureService executed successfully', response);
        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred on CreateAdventureService'
            };
        }

        if (!response.adventure) {
            return {
                success: false,
                error: 'success is true but does not have an adventure object'
            };
        }

        const selectionResponse = this.validateAdventureCharacterSelectionService.validate(response.adventure);
        if (!selectionResponse.success) {
            return {
                success: false,
                error: selectionResponse.error
            };
        }

        const missingIdError = await this.validateReferencedIds(response.adventure);
        if (missingIdError) {
            return {
                success: false,
                error: missingIdError
            };
        }

        const indexResponse = await this.adventureRepository.getAdventureIndex();
        if (!indexResponse.success || !indexResponse.entries) {
            this.logger.warning('CreateAdventureUseCase::execute - failed to load adventures', indexResponse.error);
            return { success: false, error: indexResponse.error || 'Failed to load adventures' };
        }

        const entries = indexResponse.entries;
        this.logger.debug('adventureRepository executed successfully', entries);
        const adventureName = response.adventure.name;
        const alreadyExists = entries.find((entry) => entry.name === adventureName);

        if (alreadyExists) {
            this.logger.warning(`An adventure name ${adventureName} already exists`);
            return {
                success: false,
                error: `An adventure name ${adventureName} already exists`
            };
        }

        const saveResult = await this.adventureRepository.saveAdventure({ adventure: response.adventure });
        if (!saveResult.success) {
            this.logger.warning('CreateAdventureUseCase::execute - failed to save adventure', saveResult.error);
            return { success: false, error: saveResult.error || 'Failed to save adventure' };
        }

        return {
            success: true,
            id: response.adventure.id
        };
    }

    private validate (params: CreateAdventureCaseParams): string | null {
        if (!params.name?.trim()) {
            return 'A name for an adventure is required';
        }
        if (params.systemPromptIds.length < MINIMUM_NUMBER_SYSTEM_PROMPT) {
            return 'A system prompt is required';
        }
        return null;
    }

    private buildIdLists (params: CreateAdventureCaseParams): UniqueIdList[] {
        return [
            { collection: REFERENCED_ENTITIES.CHARACTER.collection, ids: params.playableCharacterIds },
            { collection: REFERENCED_ENTITIES.CHARACTER.collection, ids: params.aiControlledCharacterIds },
            { collection: REFERENCED_ENTITIES.SYSTEM_PROMPT.collection, ids: params.systemPromptIds },
            { collection: REFERENCED_ENTITIES.WORLD.collection, ids: params.worldIds },
            { collection: REFERENCED_ENTITIES.LOCATION.collection, ids: params.locationIds },
            { collection: REFERENCED_ENTITIES.ITEM.collection, ids: params.itemIds },
        ];
    }

    private async validateReferencedIds (params: Adventure): Promise<string | null> {
        const characterError = await checkReferencedIds(
            (id: string) => this.characterRepository.getCharacterById(id),
            REFERENCED_ENTITIES.CHARACTER,
            params.characterIds
        );
        if (characterError) {
            return characterError;
        }
        const worldMasterIdError = await checkReferencedId(
            (id: string) => this.worldMasterRepository.getWorldMasterById(id),
            REFERENCED_ENTITIES.WORLD_MASTER,
            params.worldMasterId
        );
        if (worldMasterIdError) {
            return worldMasterIdError;
        }
        const systemPromptError = await checkReferencedIds(
            (id: string) => this.systemPromptRepository.getSystemPromptById(id),
            REFERENCED_ENTITIES.SYSTEM_PROMPT,
            params.systemPromptIds
        );
        if (systemPromptError) {
            return systemPromptError;
        }
        const worldError = await checkReferencedIds(
            (id: string) => this.worldRepository.getWorldById(id),
            REFERENCED_ENTITIES.WORLD,
            params.worldIds
        );
        if (worldError) {
            return worldError;
        }
        const locationError = await checkReferencedIds(
            (id: string) => this.locationRepository.getLocationById(id),
            REFERENCED_ENTITIES.LOCATION,
            params.locationIds
        );
        if (locationError) {
            return locationError;
        }
        const itemError = await checkReferencedIds(
            (id: string) => this.itemRepository.getItemById(id),
            REFERENCED_ENTITIES.ITEM,
            params.itemIds
        );
        if (itemError) {
            return itemError;
        }
        return null;
    }
}
