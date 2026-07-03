import { World } from '../entities';

export interface IGetWorldsUseCase {
    execute(): Promise<World[]>;
}
