import { Adventure } from '../entities';

export interface IAdventureRepository {
    saveAdventure (params: SaveAdventureParams): Promise<SaveAdventureRepositoryReturn>;
    updateAdventure (params: UpdateAdventureParams): Promise<UpdateAdventureReturn>;
    getAdventureById (adventureId: string): Promise<GetAdventureByIdRepositoryReturn>;
    getAdventures (): Promise<GetAdventuresRepositoryReturn>;
    eraseAdventures (): Promise<EraseAdventuresRepositoryReturn>;
    eraseAdventure (adventureId: string): Promise<EraseAdventureReturn>;
}

export type SaveAdventureRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetAdventuresRepositoryReturn = {
    success: boolean;
    adventures?: Adventure[];
    error?: string;
};

export type GetAdventureByIdRepositoryReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};

export type EraseAdventuresRepositoryReturn = {
    success: boolean;
    error?: string;
};

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
