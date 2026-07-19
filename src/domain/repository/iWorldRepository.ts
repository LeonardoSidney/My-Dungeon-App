import { World } from '../entities';

export type EraseWorldRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type EditWorldRepositoryReturn = {
    success: boolean;
    error?: string;
};

export interface IWorldRepository {
    saveWorld (params: SaveWorldParams): Promise<boolean>;
    getWorlds (): Promise<World[]>;
    eraseWorld (worldId: string): Promise<EraseWorldRepositoryReturn>;
    editWorld (params: EditWorldParams): Promise<EditWorldRepositoryReturn>;
}

export type SaveWorldParams = {
    world: World;
};

export type EditWorldParams = {
    world: World;
};
