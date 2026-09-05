import { Sampler } from '../entities';
import { SamplerEditParams } from '../services';

export interface IEditSamplerUseCase {
    execute (request: EditSamplerParams): Promise<EditSamplerReturn>;
}

export type EditSamplerParams = {
    id: string;
    editParams: SamplerEditParams;
};

export type EditSamplerReturn = {
    sampler?: Sampler;
    success: boolean;
    error?: string;
};
