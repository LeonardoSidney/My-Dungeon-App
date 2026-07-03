import { CreateAdventureRequest, CreateAdventureResponse, ICreateAdventureController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ICreateAdventureUseCase } from '@domain/use-cases';

export class CreateAdventureController implements ICreateAdventureController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: ICreateAdventureUseCase
    ) { }
    async handle(request: CreateAdventureRequest): Promise<CreateAdventureResponse> {
        this.logger.info('Executing CreateAdventureController::handle');
        const { characters, name, systemPrompts, items, locations, worlds, worldMaster } = request;
        const response = await this.useCase.execute({
            characters,
            items,
            locations,
            name,
            systemPrompts,
            worlds,
            worldMaster
        });

        return {
            success: response.success,
            adventure: response.adventure,
            error: response.error
        };
    }
}
