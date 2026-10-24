
export interface ICreateProficiencyController {
    handle(params: CreateProficiencyControllerParams): Promise<CreateProficiencyControllerResponse>;
}

export type CreateProficiencyControllerParams = {
    name: string;
    prompt: string;
    activationWord: string;
    observation?: string;
};

export type CreateProficiencyControllerResponse = {
    success: boolean;
    id?: string;
    error?: string;
};
