import { Adventure } from '../entities';

export interface IAdventureRepository {
    saveAdventure (params: SaveAdventureParams): Promise<boolean>;
    updateAdventure (params: UpdateAdventureParams): Promise<UpdateAdventureReturn>;
    getAdventures (): Promise<Adventure[]>;
    eraseAdventures (): Promise<void>;
    eraseAdventure (adventureId: string): Promise<EraseAdventureReturn>;
}

export type UpdateAdventureReturn = {
    success: boolean;
    error?: string;
};

export type EraseAdventureReturn = {
    success: boolean;
    error?: string;
};

export type SaveAdventureParams = {
    adventure: Adventure;
};

export type UpdateAdventureParams = {
    adventure: Adventure;
};
