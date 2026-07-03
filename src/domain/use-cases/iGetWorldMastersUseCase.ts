import { WorldMaster } from '../entities';

export interface IGetWorldMastersUseCase {
    execute(): Promise<WorldMaster[]>;
}
