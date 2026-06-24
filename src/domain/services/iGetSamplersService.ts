import { Sampler } from "../../entities";

export interface IGetSamplersService {
    getSystemDefaultSamplers(): Sampler[];
}
