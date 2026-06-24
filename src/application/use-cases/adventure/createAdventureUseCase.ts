import { ILogger } from "../../../domain/logger";
import { CreateAdventureServiceParams, ICreateAdventureService } from "../../../domain/services";
import { CreateAdventureCaseParams, CreateAdventureCaseReturn, ICreateAdventureUseCase } from "../../../domain/use-cases";

export class CreateAdventureUseCase implements ICreateAdventureUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly service: ICreateAdventureService
    ) { }

    public execute(params: CreateAdventureCaseParams): CreateAdventureCaseReturn {
        this.logger.info('Executing CreateAdventureUseCase', params);
        this.validateParams(params);
        const { name, characters, systemPrompt, items, location, world, worldMaster } = params;
        const adventureParams: CreateAdventureServiceParams = {
            name,
            systemPrompt,
            characters,
            items,
            location,
            world,
            worldMaster
        };
        this.logger.debug('Calling CreateAdventureService', adventureParams);
        const response = this.service.createAdventure(adventureParams);
        this.logger.debug('CreateAdventureService executed successfully', response);
        if (!response.success) {
            const unknownErrorMessage = 'An unknown error occurred on CreateAdventureService';
            throw new Error(response.error ?? unknownErrorMessage);
        }

        if (!response.adventure) {
            throw new Error('success is true but does not have an adventure object');
        }

        return {
            adventure: response.adventure
        };
    }

    private validateParams(params: CreateAdventureCaseParams): void {
        if (!params.name?.trim()) {
            throw new Error('A name for an adventure is required');
        }
    }
}
