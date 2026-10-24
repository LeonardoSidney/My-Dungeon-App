export interface IEraseProficiencyController {
    handle (request: EraseProficiencyControllerRequest): Promise<EraseProficiencyControllerResponse>;
}

export type EraseProficiencyControllerResponse = {
    success: boolean;
    error?: string;
};

export type EraseProficiencyControllerRequest = {
    id: string;
};
