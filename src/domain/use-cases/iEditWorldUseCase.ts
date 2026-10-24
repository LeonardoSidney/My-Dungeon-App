import { WorldEditParams } from '../services';

export interface IEditWorldUseCase {
    execute (request: EditWorldParams): Promise<EditWorldReturn>;
}

export type EditWorldParams = {
    id: string;
    editParams: WorldEditParams;
};

export type EditWorldReturn = {
    id?: string;
    success: boolean;
    error?: string;
};
