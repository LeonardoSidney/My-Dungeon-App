import { Status } from '../entities';

export interface IGetStatusesUseCase {
    execute(): Promise<Status[]>;
}
