import { LocationEditParams } from '../services';

export interface IEditLocationUseCase {
    execute (request: EditLocationParams): Promise<EditLocationReturn>;
}

export type EditLocationParams = {
    id: string;
    editParams: LocationEditParams;
};

export type EditLocationReturn = {
    id?: string;
    success: boolean;
    error?: string;
};
