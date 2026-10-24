import { WorldEditParams } from '../services';

export type EditWorldControllerParams = {
    id: string;
    editParams: WorldEditParams;
};

export type EditWorldControllerResponse = {
    success: boolean;
    id?: string;
    error?: string;
};

export interface IEditWorldController {
    handle (params: EditWorldControllerParams): Promise<EditWorldControllerResponse>;
}
