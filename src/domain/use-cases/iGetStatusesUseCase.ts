import { Status } from '../entities';

export interface IGetStatusesUseCase {
    execute (): Promise<GetStatusesUseCaseReturn>;
}

export type GetStatusesUseCaseReturn = {
    success: boolean;
    statuses?: Status[];
    error?: string;
};
