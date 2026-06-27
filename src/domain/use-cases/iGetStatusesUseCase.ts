import { Status } from "../entities/Status";

export interface IGetStatusesUseCase {
    execute(): Promise<Status[]>;
}
