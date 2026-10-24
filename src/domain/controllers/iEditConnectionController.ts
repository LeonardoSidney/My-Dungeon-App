import { ConnectionEditParams } from '../services';

export type EditConnectionControllerParams = {
    id: string;
    editParams: ConnectionEditParams;
};

export type EditConnectionControllerResponse = {
    success: boolean;
    id?: string;
    error?: string;
};

export interface IEditConnectionController {
    handle(request: EditConnectionControllerParams): Promise<EditConnectionControllerResponse>;
}
