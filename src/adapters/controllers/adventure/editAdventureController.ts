import {
    EditAdventureControllerRequest,
    EditAdventureControllerResponse,
    IEditAdventureController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditAdventureUseCase } from '@domain/use-cases';

export class EditAdventureController implements IEditAdventureController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IEditAdventureUseCase
    ) { }

    async handle (request: EditAdventureControllerRequest): Promise<EditAdventureControllerResponse> {
        this.logger.info('Executing EditAdventureController::handle');
        const { id, name, systemPrompts, characters, worldMaster, locations, worlds, items, chat, createdAt } = request;
        const response = await this.useCase.execute({
            id,
            name,
            systemPrompts,
            characters,
            worldMaster,
            locations,
            worlds,
            items,
            chat,
            createdAt
        });

        return {
            success: response.success,
            adventure: response.adventure,
            error: response.error
        };
    }
}
