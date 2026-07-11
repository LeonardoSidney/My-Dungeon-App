import { Adventure } from '@domain/entities';

export interface IGetAdventureTextUseCase {
    execute(params: GetAdventureTextUseCaseParams): Promise<GetAdventureTextUseCaseResponse>;
}

export type GetAdventureTextUseCaseParams = {
    adventure: Adventure;
};

export type GetAdventureTextUseCaseResponse = {
    success: boolean;
    prompt?: string;
    error?: string;
};
