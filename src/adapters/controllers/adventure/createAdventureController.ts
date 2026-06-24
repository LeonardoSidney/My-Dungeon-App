import { CreateAdventureRequest, CreateAdventureResponse, ICreateAdventureController } from "../../../domain/controllers";
import { ILogger } from "../../../domain/logger";
import { ICreateAdventureUseCase } from "../../../domain/use-cases";

export class CreateAdventureController implements ICreateAdventureController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: ICreateAdventureUseCase
    ) { }
    public handle(request: CreateAdventureRequest): CreateAdventureResponse {
        this.logger.info("Executing CreateAdventureController::handle");
        const { characters, name, systemPrompt, items, location, world, worldMaster } = request;
        const response = this.useCase.execute({
            characters,
            items,
            location,
            name,
            systemPrompt,
            world,
            worldMaster
        });

        return {
            adventure: response.adventure
        };
    }
}
