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
import { AdventureEditParams, IEditAdventureService } from '@domain/services';
import { EditAdventureParams, EditAdventureReturn, IEditAdventureUseCase } from '@domain/use-cases';
import { checkReferencedId, checkReferencedIds } from '@application/shared/validateReferencedIds';

export class EditAdventureUseCase implements IEditAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditAdventureService,
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
                adventure: undefined,
                error: validationError
            };
        }
        const missingIdError = await this.validateReferencedIds(params.editParams);
        if (missingIdError) {
            return {
                success: false,
                adventure: undefined,
                error: missingIdError
            };
        }

        const { id, editParams } = params;
        const adventure = await this.adventureRepository.getAdventureById(id);
        if (!adventure) {
            return {
                success: false,
                adventure: undefined,
                error: `Adventure with id ${id} not found`
            };
        }

        this.logger.debug('Calling EditAdventureService', { id, editParams });
        const response = this.service.editAdventure({ adventure, editParams });
        this.logger.debug('EditAdventureService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                adventure: undefined,
                error: response.error || 'An unknown error occurred on EditAdventureService'
            };
        }

        if (!response.adventure) {
            return {
                success: false,
                adventure: undefined,
                error: 'Success is true but does not have an adventure'
            };
        }

        const editedAdventure = response.adventure;
        const existingAdventures = await this.adventureRepository.getAdventures();
        const duplicateAdventure = existingAdventures.find(
            (a) => a.name === editedAdventure.name && a.id !== editedAdventure.id
        );

        if (duplicateAdventure) {
            this.logger.warning(`Adventure with name ${editedAdventure.name} already exists`);
            return {
                success: false,
                adventure: undefined,
                error: `Adventure with name ${editedAdventure.name} already exists`
            };
        }

        const editResult = await this.adventureRepository.updateAdventure({ adventure: editedAdventure });
        if (!editResult.success) {
            this.logger.error('Failed to save edited adventure');
            return {
                success: false,
                adventure: undefined,
                error: editResult.error || 'Failed to save edited adventure'
            };
        }

        return {
            success: true,
            adventure: editedAdventure
        };
    }

    private validate (params: EditAdventureParams): string | null {
        if (!params.id?.trim()) {
            return 'Adventure id is required';
        }
        if (!params.editParams.name?.trim()) {
            return 'Adventure name is required';
        }
        return null;
    }

    private async validateReferencedIds (editParams: AdventureEditParams): Promise<string | null> {
        const characterError = await checkReferencedIds(
            (id) => this.characterRepository.getCharacterById(id),
            editParams.characterIds,
            'Character'
        );
        if (characterError) {
            return characterError;
        }
        const worldMasterIdError = await checkReferencedId(
            (id) => this.worldMasterRepository.getWorldMasterById(id),
            editParams.worldMasterId,
            'WorldMaster'
        );
        if (worldMasterIdError) {
            return worldMasterIdError;
        }
        const systemPromptError = await checkReferencedIds(
            (id) => this.systemPromptRepository.getSystemPromptById(id),
            editParams.systemPromptIds,
            'SystemPrompt'
        );
        if (systemPromptError) {
            return systemPromptError;
        }
        const worldError = await checkReferencedIds(
            (id) => this.worldRepository.getWorldById(id),
            editParams.worldIds,
            'World'
        );
        if (worldError) {
            return worldError;
        }
        const locationError = await checkReferencedIds(
            (id) => this.locationRepository.getLocationById(id),
            editParams.locationIds,
            'Location'
        );
        if (locationError) {
            return locationError;
        }
        const itemError = await checkReferencedIds(
            (id) => this.itemRepository.getItemById(id),
            editParams.itemIds,
            'Item'
        );
        if (itemError) {
            return itemError;
        }
        return null;
    }
}
