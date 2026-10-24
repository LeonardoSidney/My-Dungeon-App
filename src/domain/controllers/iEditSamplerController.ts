import { SamplerEditParams } from '../services';

export interface IEditSamplerController {
    handle (params: EditSamplerControllerParams): Promise<EditSamplerControllerResponse>;
}

export type EditSamplerControllerParams = {
    id: string;
    editParams: SamplerEditParams;
};

export type EditSamplerControllerResponse = {
    id?: string;
    success: boolean;
    error?: string;
};
