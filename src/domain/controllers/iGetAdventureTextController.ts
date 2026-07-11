import { Adventure } from '@domain/entities';

export interface IGetAdventureTextController {
    handle(params: GetAdventureTextControllerParams): Promise<GetAdventureTextControllerResponse>;
}

export type GetAdventureTextControllerParams = {
    adventure: Adventure;
};

export type GetAdventureTextControllerResponse = {
    success: boolean;
    prompt?: string;
    error?: string;
};
