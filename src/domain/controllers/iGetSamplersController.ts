import { Sampler } from "../entities";

export interface IGetSamplersController {
    handle(): Promise<Sampler[]>
}
