import { Status } from "../entities/Status";

export interface IGetStatusesController {
    handle(): Promise<Status[]>;
}
