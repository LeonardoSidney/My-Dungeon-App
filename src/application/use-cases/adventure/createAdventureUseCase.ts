import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { CreateAdventureServiceParams, ICreateAdventureService } from '@domain/services';
import { CreateAdventureCaseParams, CreateAdventureCaseReturn, ICreateAdventureUseCase } from '@domain/use-cases';

export class CreateAdventureUseCase implements ICreateAdventureUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly service: ICreateAdventureService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute(params: CreateAdventureCaseParams): Promise<CreateAdventureCaseReturn> {
        this.logger.info('Executing CreateAdventureUseCase::execute', params);
        this.validateParams(params);
        const { name, characters, systemPrompts, items, locations, worlds, worldMaster } = params;
        const adventureParams: CreateAdventureServiceParams = {
            name,
            systemPrompts,
            characters,
            items,
            locations,
            worlds,
            worldMaster
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
            throw new Error('success is true but does not have an adventure object');
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

    private validateParams(params: CreateAdventureCaseParams): void {
        if (!params.name?.trim()) {
            throw new Error('A name for an adventure is required');
        }
    }
}
