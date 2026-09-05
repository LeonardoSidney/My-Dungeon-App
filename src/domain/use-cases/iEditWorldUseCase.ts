import { World } from '../entities';
import { WorldEditParams } from '../services';

export interface IEditWorldUseCase {
    execute (request: EditWorldParams): Promise<EditWorldReturn>;
}

export type EditWorldParams = {
    id: string;
    editParams: WorldEditParams;
};

export type EditWorldReturn = {
    world?: World;
    success: boolean;
    error?: string;
};
