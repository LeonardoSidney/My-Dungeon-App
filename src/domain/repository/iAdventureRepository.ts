import { Adventure } from '../entities';

export interface IAdventureRepository {
    saveAdventure(params: SaveAdventureParams): Promise<boolean>;
    updateAdventure(params: UpdateAdventureParams): Promise<boolean>;
    getAdventures(): Promise<Adventure[]>;
    eraseAdventures(): Promise<void>;
}

export type SaveAdventureParams = {
    adventure: Adventure;
};

export type UpdateAdventureParams = {
    adventure: Adventure;
};
