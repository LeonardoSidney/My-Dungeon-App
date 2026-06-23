import { ICreateAdventureUseCase } from "../../../application/use-cases";
import { ILogger } from "../../../domain/logger";
import { CreateAdventureRequest, CreateAdventureResponse, ICreateAdventureController } from "./iCreateAdventureController";

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
