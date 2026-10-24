import { Sampler } from '../entities';

export interface ISamplerRepository {
    saveSampler (params: SaveSamplerParams): Promise<SaveSamplerRepositoryReturn>;
    getSamplers (): Promise<GetSamplersRepositoryReturn>;
    getSamplerById (samplerId: string): Promise<GetSamplerByIdRepositoryReturn>;
    editSampler (params: EditSamplerParams): Promise<EditSamplerRepositoryReturn>;
    eraseSampler (samplerId: string): Promise<EraseSamplerRepositoryReturn>;
}

export type SaveSamplerParams = {
    sampler: Sampler;
};

export type EditSamplerParams = {
    sampler: Sampler;
};

export type SaveSamplerRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetSamplersRepositoryReturn = {
    success: boolean;
    samplers?: Sampler[];
    error?: string;
};

export type GetSamplerByIdRepositoryReturn = {
    success: boolean;
    sampler?: Sampler;
    error?: string;
};

export type EditSamplerRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type EraseSamplerRepositoryReturn = {
    success: boolean;
    error?: string;
};
