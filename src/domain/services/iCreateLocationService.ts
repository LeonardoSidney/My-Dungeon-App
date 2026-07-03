import { Location } from '../entities';

export interface ICreateLocationService {
    createLocation(params: CreateLocationServiceParams): CreateLocationServiceResponse;
}

export type CreateLocationServiceParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateLocationServiceResponse = {
    success: boolean;
    location?: Location;
    error?: string;
};
