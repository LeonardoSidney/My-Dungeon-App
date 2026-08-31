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
import { CreateAdventureServiceParams, ICreateAdventureService } from '@domain/services';
import { CreateAdventureCaseParams, CreateAdventureCaseReturn, ICreateAdventureUseCase } from '@domain/use-cases';
import { checkReferencedId, checkReferencedIds } from '@application/shared/validateReferencedIds';

export class CreateAdventureUseCase implements ICreateAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: ICreateAdventureService,
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
        const validationError = this.validateParams(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }
        const missingIdError = await this.validateReferencedIds(params);
        if (missingIdError) {
            return {
                success: false,
                error: missingIdError
            };
        }
        const { name, systemPromptIds, characterIds, worldMasterId, characterAsWorldMasterId, charactersControlledByAi, worldIds, locationIds, itemIds } = params;
        const adventureParams: CreateAdventureServiceParams = {
            name,
            systemPromptIds,
            characterIds,
            worldMasterId,
            characterAsWorldMasterId,
            charactersControlledByAi,
            worldIds,
            locationIds,
            itemIds
        };
        this.logger.debug('Calling CreateAdventureService::createAdventure', adventureParams);
        const response = this.service.createAdventure(adventureParams);
        this.logger.debug('CreateAdventureService executed successfully', response);
        if (!response.success) {
            return {
                success: false,
                error: response.error
            };
        }

        if (!response.adventure) {
            return {
                success: false,
                error: 'success is true but does not have an adventure object'
            };
        }

        const adventures = await this.adventureRepository.getAdventures();
        this.logger.debug('adventureRepository executed successfully', adventures);
        const alreadyExists = adventures.find((adventure) => adventure.name === name);

        if (alreadyExists) {
            this.logger.warning(`An adventure name ${name} already exists`);
            return {
                success: false,
                error: `An adventure name ${name} already exists`
            };
        }

        await this.adventureRepository.saveAdventure({ adventure: response.adventure });

        return {
            success: true,
            adventure: response.adventure
        };
    }

    private validateParams (params: CreateAdventureCaseParams): string | null {
        if (!params.name?.trim()) {
            return 'A name for an adventure is required';
        }
        return null;
    }

    private async validateReferencedIds (params: CreateAdventureCaseParams): Promise<string | null> {
        const characterError = await checkReferencedIds(
            (id) => this.characterRepository.getCharacterById(id),
            params.characterIds,
            'Character'
        );
        if (characterError) {
            return characterError;
        }
        const worldMasterIdError = await checkReferencedId(
            (id) => this.worldMasterRepository.getWorldMasterById(id),
            params.worldMasterId,
            'WorldMaster'
        );
        if (worldMasterIdError) {
            return worldMasterIdError;
        }
        const systemPromptError = await checkReferencedIds(
            (id) => this.systemPromptRepository.getSystemPromptById(id),
            params.systemPromptIds,
            'SystemPrompt'
        );
        if (systemPromptError) {
            return systemPromptError;
        }
        const worldError = await checkReferencedIds(
            (id) => this.worldRepository.getWorldById(id),
            params.worldIds,
            'World'
        );
        if (worldError) {
            return worldError;
        }
        const locationError = await checkReferencedIds(
            (id) => this.locationRepository.getLocationById(id),
            params.locationIds,
            'Location'
        );
        if (locationError) {
            return locationError;
        }
        const itemError = await checkReferencedIds(
            (id) => this.itemRepository.getItemById(id),
            params.itemIds,
            'Item'
        );
        if (itemError) {
            return itemError;
        }
        return null;
    }
}
