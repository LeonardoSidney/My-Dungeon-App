import { Sampler } from '../entities';

export interface IGetSamplersUseCase {
    execute(): Promise<Sampler[]>;
}
