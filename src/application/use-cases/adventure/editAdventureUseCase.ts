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
    AdventureFormFields,
    IEditAdventureService,
    IValidateAdventureCharacterSelectionService,
    IValidateUniqueIdsService,
    UniqueIdList,
} from '@domain/services';
import { Adventure } from '@domain/entities';
import { EditAdventureParams, EditAdventureReturn, IEditAdventureUseCase } from '@domain/use-cases';
import { MINIMUM_NUMBER_SYSTEM_PROMPT } from '@domain/constants/adventure';
import { REFERENCED_ENTITIES } from '@domain/constants/referencedEntities';
import { checkReferencedId, checkReferencedIds } from '@application/shared/validateReferencedIds';

export class EditAdventureUseCase implements IEditAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditAdventureService,
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

    async execute (params: EditAdventureParams): Promise<EditAdventureReturn> {
        this.logger.info('Executing EditAdventureUseCase::execute');
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }
        const { id, editParams } = params;
        const uniqueIdsResponse = this.validateUniqueIdsService.validate({ idLists: this.buildIdLists(editParams) });
        if (!uniqueIdsResponse.success) {
            return {
                success: false,
                error: uniqueIdsResponse.error
            };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(id);
        if (!adventureResponse.success) {
            this.logger.warning('EditAdventureUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error || 'Failed to load adventure' };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return {
                success: false,
                error: `Adventure with id ${id} not found`
            };
        }

        this.logger.debug('Calling EditAdventureService', { id, editParams });
        const response = this.service.editAdventure({ adventure, editParams });
        this.logger.debug('EditAdventureService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred on EditAdventureService'
            };
        }

        if (!response.adventure) {
            return {
                success: false,
                error: 'Success is true but does not have an adventure'
            };
        }

        const editedAdventure = response.adventure;
        const selectionResponse = this.validateAdventureCharacterSelectionService.validate(editedAdventure);
        if (!selectionResponse.success) {
            return {
                success: false,
                error: selectionResponse.error
            };
        }

        const missingIdError = await this.validateReferencedIds(editedAdventure);
        if (missingIdError) {
            return {
                success: false,
                error: missingIdError
            };
        }

        const indexResponse = await this.adventureRepository.getAdventureIndex();
        if (!indexResponse.success || !indexResponse.entries) {
            this.logger.warning('EditAdventureUseCase::execute - failed to load adventures', indexResponse.error);
            return { success: false, error: indexResponse.error || 'Failed to load adventures' };
        }

        const duplicateAdventure = indexResponse.entries.find(
            (entry) => entry.name === editedAdventure.name && entry.id !== editedAdventure.id
        );

        if (duplicateAdventure) {
            this.logger.warning(`Adventure with name ${editedAdventure.name} already exists`);
            return {
                success: false,
                error: `Adventure with name ${editedAdventure.name} already exists`
            };
        }

        const editResult = await this.adventureRepository.updateAdventure({ adventure: editedAdventure });
        if (!editResult.success) {
            this.logger.error('Failed to save edited adventure');
            return {
                success: false,
                error: editResult.error || 'Failed to save edited adventure'
            };
        }

        return {
            success: true,
            id: editedAdventure.id
        };
    }

    private validate (params: EditAdventureParams): string | null {
        if (!params.id?.trim()) {
            return 'Adventure id is required';
        }
        if (!params.editParams.name?.trim()) {
            return 'Adventure name is required';
        }
        if (params.editParams.systemPromptIds.length < MINIMUM_NUMBER_SYSTEM_PROMPT) {
            return 'A system prompt is required';
        }
        return null;
    }

    private buildIdLists (editParams: AdventureFormFields): UniqueIdList[] {
        return [
            { collection: REFERENCED_ENTITIES.CHARACTER.collection, ids: editParams.playableCharacterIds },
            { collection: REFERENCED_ENTITIES.CHARACTER.collection, ids: editParams.aiControlledCharacterIds },
            { collection: REFERENCED_ENTITIES.SYSTEM_PROMPT.collection, ids: editParams.systemPromptIds },
            { collection: REFERENCED_ENTITIES.WORLD.collection, ids: editParams.worldIds },
            { collection: REFERENCED_ENTITIES.LOCATION.collection, ids: editParams.locationIds },
            { collection: REFERENCED_ENTITIES.ITEM.collection, ids: editParams.itemIds },
        ];
    }

    private async validateReferencedIds (editParams: Adventure): Promise<string | null> {
        const characterError = await checkReferencedIds(
            (id: string) => this.characterRepository.getCharacterById(id),
            REFERENCED_ENTITIES.CHARACTER,
            editParams.characterIds
        );
        if (characterError) {
            return characterError;
        }
        const worldMasterIdError = await checkReferencedId(
            (id: string) => this.worldMasterRepository.getWorldMasterById(id),
            REFERENCED_ENTITIES.WORLD_MASTER,
            editParams.worldMasterId
        );
        if (worldMasterIdError) {
            return worldMasterIdError;
        }
        const systemPromptError = await checkReferencedIds(
            (id: string) => this.systemPromptRepository.getSystemPromptById(id),
            REFERENCED_ENTITIES.SYSTEM_PROMPT,
            editParams.systemPromptIds
        );
        if (systemPromptError) {
            return systemPromptError;
        }
        const worldError = await checkReferencedIds(
            (id: string) => this.worldRepository.getWorldById(id),
            REFERENCED_ENTITIES.WORLD,
            editParams.worldIds
        );
        if (worldError) {
            return worldError;
        }
        const locationError = await checkReferencedIds(
            (id: string) => this.locationRepository.getLocationById(id),
            REFERENCED_ENTITIES.LOCATION,
            editParams.locationIds
        );
        if (locationError) {
            return locationError;
        }
        const itemError = await checkReferencedIds(
            (id: string) => this.itemRepository.getItemById(id),
            REFERENCED_ENTITIES.ITEM,
            editParams.itemIds
        );
        if (itemError) {
            return itemError;
        }
        return null;
    }
}
