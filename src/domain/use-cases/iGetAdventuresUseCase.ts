import { Adventure } from '../entities';

export interface IGetAdventuresUseCase {
    execute(): Promise<Adventure[]>;
}
