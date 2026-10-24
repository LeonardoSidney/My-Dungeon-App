import { World } from '../entities';

export interface IGetWorldByIdUseCase {
    execute (params: GetWorldByIdUseCaseParams): Promise<GetWorldByIdUseCaseReturn>;
}

export type GetWorldByIdUseCaseParams = {
    id: string;
};

export type GetWorldByIdUseCaseReturn = {
    success: boolean;
    world?: World;
    error?: string;
};
