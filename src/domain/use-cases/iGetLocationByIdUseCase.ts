import { Location } from '../entities';

export interface IGetLocationByIdUseCase {
    execute (params: GetLocationByIdUseCaseParams): Promise<GetLocationByIdUseCaseReturn>;
}

export type GetLocationByIdUseCaseParams = {
    id: string;
};

export type GetLocationByIdUseCaseReturn = {
    success: boolean;
    location?: Location;
    error?: string;
};
