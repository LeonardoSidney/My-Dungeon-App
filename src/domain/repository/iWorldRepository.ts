import { World } from '../entities';

export interface IWorldRepository {
    saveWorld(params: SaveWorldParams): Promise<boolean>;
    getWorlds(): Promise<World[]>;
}

export type SaveWorldParams = {
    world: World;
};
