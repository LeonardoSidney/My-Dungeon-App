import { IGetSamplersController } from "../../../domain/controllers";
import { Sampler } from "../../../domain/entities";
import { ILogger } from "../../../domain/logger";
import { IGetSamplersUseCase } from "../../../domain/use-cases";

export class GetSamplersController implements IGetSamplersController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: IGetSamplersUseCase
    ) { }
    public handle(): Promise<Sampler[]> {
        this.logger.info("Execute GetSamplersController::handle");
        return this.useCase.execute();
    }
}
