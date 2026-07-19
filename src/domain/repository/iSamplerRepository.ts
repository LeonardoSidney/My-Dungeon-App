import { Sampler } from '../entities';

export interface ISamplerRepository {
    getSamplers (): Promise<Sampler[]>;
    saveSampler (params: SaveSamplerParams): Promise<boolean>;
    editSampler (params: EditSamplerParams): Promise<EditSamplerRepositoryReturn>;
    eraseSampler (samplerId: string): Promise<EraseSamplerRepositoryReturn>;
}


export type SaveSamplerParams = {
    sampler: Sampler;
};

export type EditSamplerParams = {
    sampler: Sampler;
};

export type EditSamplerRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type EraseSamplerRepositoryReturn = {
    success: boolean;
    error?: string;
}

