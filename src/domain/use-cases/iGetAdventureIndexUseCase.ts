import { AdventureIndexEntry } from '../entities';

export interface IGetAdventureIndexUseCase {
    execute (): Promise<GetAdventureIndexUseCaseReturn>;
}

export type GetAdventureIndexUseCaseReturn = {
    success: boolean;
    entries?: AdventureIndexEntry[];
    error?: string;
};
