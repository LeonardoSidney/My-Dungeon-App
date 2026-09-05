import { World } from '../entities';
import { WorldEditParams } from '../services';

export type EditWorldControllerParams = {
    id: string;
    editParams: WorldEditParams;
};

export type EditWorldControllerResponse = {
    success: boolean;
    world?: World;
    error?: string;
};

export interface IEditWorldController {
    handle (params: EditWorldControllerParams): Promise<EditWorldControllerResponse>;
}
