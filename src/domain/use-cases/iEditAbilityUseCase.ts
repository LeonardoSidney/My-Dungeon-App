import { AbilityEditParams } from '../services';

export interface IEditAbilityUseCase {
    execute (request: EditAbilityParams): Promise<EditAbilityReturn>;
}

export type EditAbilityParams = {
    id: string;
    editParams: AbilityEditParams;
};

export type EditAbilityReturn = {
    id?: string;
    success: boolean;
    error?: string;
};
