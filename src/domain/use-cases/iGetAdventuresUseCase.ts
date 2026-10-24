import { Adventure } from '../entities';

export interface IGetAdventuresUseCase {
    execute (): Promise<GetAdventuresUseCaseReturn>;
}

export type GetAdventuresUseCaseReturn = {
    success: boolean;
    adventures?: Adventure[];
    error?: string;
};
