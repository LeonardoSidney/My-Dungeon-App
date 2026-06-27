import { IGetProficienciesController } from "../../../domain/controllers";
import { Proficiency } from "../../../domain/entities/Proficiency";
import { ILogger } from "../../../domain/logger";
import { IGetProficienciesUseCase } from "../../../domain/use-cases/iGetProficienciesUseCase";

export class GetProficienciesController implements IGetProficienciesController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: IGetProficienciesUseCase
    ) { }

    async handle(): Promise<Proficiency[]> {
        this.logger.info("Executing GetProficienciesController::handle");
        return await this.useCase.execute();
    }
}
