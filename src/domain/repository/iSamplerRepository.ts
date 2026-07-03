import { Sampler } from '../entities';

export interface ISamplerRepository {
    getSamplers(): Promise<Sampler[]>;
    saveSampler(params: SaveSamplerParams): Promise<boolean>;
}


export type SaveSamplerParams = {
    sampler: Sampler;
}

