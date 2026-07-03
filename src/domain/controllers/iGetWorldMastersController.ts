import { WorldMaster } from '../entities';

export interface IGetWorldMastersController {
    handle(): Promise<WorldMaster[]>;
}
