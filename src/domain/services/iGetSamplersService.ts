import { Sampler } from '../entities';

export interface IGetSamplersService {
    getSystemDefaultSamplers (): Sampler[];
    findSystemDefaultSampler (samplerId: string): Sampler | undefined;
}
