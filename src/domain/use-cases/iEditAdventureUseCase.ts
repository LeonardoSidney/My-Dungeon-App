import { Adventure } from '../entities';
import { AdventureEditParams } from '../services';

export interface IEditAdventureUseCase {
    execute (params: EditAdventureParams): Promise<EditAdventureReturn>;
}

export type EditAdventureParams = {
    id: string;
    editParams: AdventureEditParams;
};

export type EditAdventureReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
