import { Location } from '../entities';

export interface ICreateLocationController {
    handle(request: CreateLocationRequest): Promise<CreateLocationResponse>;
}

export type CreateLocationRequest = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateLocationResponse = {
    success: boolean;
    location?: Location;
    error?: string;
};
