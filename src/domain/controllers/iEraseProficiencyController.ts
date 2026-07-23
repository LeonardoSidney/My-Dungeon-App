export interface IEraseProficiencyController {
    handle (proficiencyId: string): Promise<EraseProficiencyControllerResponse>;
}

export type EraseProficiencyControllerParams = string;

export type EraseProficiencyControllerResponse = {
    success: boolean;
    error?: string;
};
