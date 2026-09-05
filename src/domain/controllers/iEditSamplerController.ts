import { Sampler } from '../entities';
import { SamplerEditParams } from '../services';

export interface IEditSamplerController {
    handle (params: EditSamplerControllerParams): Promise<EditSamplerControllerResponse>;
}

export type EditSamplerControllerParams = {
    id: string;
    editParams: SamplerEditParams;
};

export type EditSamplerControllerResponse = {
    sampler?: Sampler;
    success: boolean;
    error?: string;
};
