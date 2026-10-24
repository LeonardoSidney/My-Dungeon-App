import type { AdventureFormFields } from '../services';

export interface IEditAdventureUseCase {
    execute (params: EditAdventureParams): Promise<EditAdventureReturn>;
}

export type EditAdventureParams = {
    id: string;
    editParams: AdventureFormFields;
};

export type EditAdventureReturn = {
    success: boolean;
    id?: string;
    error?: string;
};
