import { Connection } from '../entities';

export interface IGetConnectionsUseCase {
    execute (): Promise<GetConnectionsUseCaseReturn>;
}

export type GetConnectionsUseCaseReturn = {
    success: boolean;
    connections?: Connection[];
    error?: string;
};
