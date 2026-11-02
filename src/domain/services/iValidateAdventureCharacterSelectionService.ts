import { Adventure } from '../entities';

export interface IValidateAdventureCharacterSelectionService {
    validate (params: ValidateAdventureCharacterSelectionServiceParams): ValidateAdventureCharacterSelectionServiceReturn;
}

export type ValidateAdventureCharacterSelectionServiceParams = Pick<
    Adventure,
    'characterIds' | 'worldMasterId' | 'characterAsWorldMasterId' | 'charactersControlledByAi'
>;

export type ValidateAdventureCharacterSelectionServiceReturn = {
    success: boolean;
    error?: string;
};
