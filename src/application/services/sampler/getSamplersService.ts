import { DEFAULT_SAMPLER } from "../../../domain/constants/sampler";
import { Sampler } from "../../../domain/entities";
import { IGetSamplersService } from "../../../domain/services";

export class GetSamplersService implements IGetSamplersService {
    public getSystemDefaultSamplers(): Sampler[] {
        return [DEFAULT_SAMPLER];
    }
}
