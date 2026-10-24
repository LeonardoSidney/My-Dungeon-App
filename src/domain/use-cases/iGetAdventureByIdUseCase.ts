import { Adventure } from '../entities';

export interface IGetAdventureByIdUseCase {
    execute (params: GetAdventureByIdUseCaseParams): Promise<GetAdventureByIdUseCaseResponse>;
}

export type GetAdventureByIdUseCaseParams = {
    id: string;
};

export type GetAdventureByIdUseCaseResponse = {
    success: boolean;
    adventure?: Adventure;
    error?: string;
};
