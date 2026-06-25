import { DEFAULT_SAMPLER } from "../../../domain/constants/sampler";
import { Sampler } from "../../../domain/entities";
import { ILogger } from "../../../domain/logger";
import { IGetSamplersService } from "../../../domain/services";

export class GetSamplersService implements IGetSamplersService {
    constructor(
        private readonly logger: ILogger
    ) { }
    public getSystemDefaultSamplers(): Sampler[] {
        this.logger.info("Executing GetSamplersService::getSystemDefaultSamplers");
        return [DEFAULT_SAMPLER];
    }
}
