import { Adventure } from '../entities';

export interface IEditAdventureService {
    editAdventure (params: EditAdventureServiceParams): EditAdventureServiceReturn;
}

export type AdventureEditParams = Omit<Adventure, 'id' | 'createdAt' | 'updatedAt'>;

export type EditAdventureServiceParams = {
    adventure: Adventure;
    editParams: AdventureEditParams;
};

export type EditAdventureServiceReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
