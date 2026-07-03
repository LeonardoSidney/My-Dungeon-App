import { Status } from '../entities';

export interface IGetStatusesController {
    handle(): Promise<Status[]>;
}
