import { Adventure } from '../entities';
import { AdventureFormFields } from './iCreateAdventureService';

export interface IEditAdventureService {
    editAdventure (params: EditAdventureServiceParams): EditAdventureServiceReturn;
}

export type EditAdventureServiceParams = {
    adventure: Adventure;
    editParams: AdventureFormFields;
};

export type EditAdventureServiceReturn = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
