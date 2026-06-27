import { Proficiency } from "../../../domain/entities/Proficiency";
import { ILogger } from "../../../domain/logger";
import { IProficiencyRepository } from "../../../domain/repository";
import { IGetProficienciesUseCase } from "../../../domain/use-cases/iGetProficienciesUseCase";

export class GetProficienciesUseCase implements IGetProficienciesUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly proficiencyRepository: IProficiencyRepository
    ) { }

    async execute(): Promise<Proficiency[]> {
        this.logger.info("Executing GetProficienciesUseCase::execute");
        return this.proficiencyRepository.getProficiencies();
    }
}
