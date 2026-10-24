import { World } from '../entities';

export interface IWorldRepository {
    saveWorld (params: SaveWorldParams): Promise<SaveWorldRepositoryReturn>;
    getWorlds (): Promise<GetWorldsRepositoryReturn>;
    getWorldById (worldId: string): Promise<GetWorldByIdRepositoryReturn>;
    editWorld (params: EditWorldParams): Promise<EditWorldRepositoryReturn>;
    eraseWorld (worldId: string): Promise<EraseWorldRepositoryReturn>;
}

export type SaveWorldParams = {
    world: World;
};

export type EditWorldParams = {
    world: World;
};

export type SaveWorldRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetWorldsRepositoryReturn = {
    success: boolean;
    worlds?: World[];
    error?: string;
};

export type GetWorldByIdRepositoryReturn = {
    success: boolean;
    world?: World;
    error?: string;
};

export type EditWorldRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type EraseWorldRepositoryReturn = {
    success: boolean;
    error?: string;
};
