import { Connection } from '../entities';
import { ConnectionEditParams } from '../services';

export interface IEditConnectionUseCase {
    execute(request: EditConnectionParams): Promise<EditConnectionReturn>;
}

export type EditConnectionParams = {
    id: string;
    editParams: ConnectionEditParams;
};

export type EditConnectionReturn = {
    connection?: Connection;
    success: boolean;
    error?: string;
};
