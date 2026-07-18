import { Connection } from '../entities';

export type EditConnectionControllerRequest = {
    id: string;
    name: string;
    ip: string;
    port?: number;
    auth?: string;
    createdAt: Date;
};

export type EditConnectionControllerResponse = {
    success: boolean;
    connection?: Connection;
    error?: string;
};

export interface IEditConnectionController {
    handle(request: EditConnectionControllerRequest): Promise<EditConnectionControllerResponse>;
}
