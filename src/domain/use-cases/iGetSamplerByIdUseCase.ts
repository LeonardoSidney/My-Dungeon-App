import { Sampler } from '../entities';

export interface IGetSamplerByIdUseCase {
    execute (params: GetSamplerByIdUseCaseParams): Promise<GetSamplerByIdUseCaseReturn>;
}

export type GetSamplerByIdUseCaseParams = {
    id: string;
};

export type GetSamplerByIdUseCaseReturn = {
    success: boolean;
    sampler?: Sampler;
    error?: string;
};
