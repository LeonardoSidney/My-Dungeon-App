import { Sampler } from '../entities';

export interface IGetSamplersUseCase {
    execute (): Promise<GetSamplersUseCaseReturn>;
}

export type GetSamplersUseCaseReturn = {
    success: boolean;
    samplers?: Sampler[];
    error?: string;
};
