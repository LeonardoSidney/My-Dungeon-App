import { World } from '../entities';

export type WorldEditParams = Omit<World, 'id' | 'createdAt' | 'updatedAt'>;

export interface IEditWorldService {
    editWorld(request: EditWorldServiceParams): EditWorldServiceReturn;
}

export type EditWorldServiceParams = {
    world: World;
    editParams: WorldEditParams;
};

export type EditWorldServiceReturn = {
    success: boolean;
    world?: World;
    error?: string;
};
