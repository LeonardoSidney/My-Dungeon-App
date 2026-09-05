import { Sampler } from '../entities';

export interface IEditSamplerService {
    editSampler (request: EditSamplerServiceParams): EditSamplerServiceReturn;
}

export type SamplerEditParams = Omit<Sampler, 'id' | 'createdAt' | 'updatedAt'>;

export type EditSamplerServiceParams = {
    sampler: Sampler;
    editParams: SamplerEditParams;
};

export type EditSamplerServiceReturn = {
    success: boolean;
    sampler?: Sampler;
    error?: string;
};
