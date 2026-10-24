import { Location } from '../entities';

export interface IGetLocationsUseCase {
    execute (): Promise<GetLocationsUseCaseReturn>;
}

export type GetLocationsUseCaseReturn = {
    success: boolean;
    locations?: Location[];
    error?: string;
};
