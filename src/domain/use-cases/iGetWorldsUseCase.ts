import { World } from '../entities';

export interface IGetWorldsUseCase {
    execute (): Promise<GetWorldsUseCaseReturn>;
}

export type GetWorldsUseCaseReturn = {
    success: boolean;
    worlds?: World[];
    error?: string;
};
