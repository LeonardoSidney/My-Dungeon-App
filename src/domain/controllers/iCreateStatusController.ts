
export interface ICreateStatusController {
    handle(params: CreateStatusControllerParams): Promise<CreateStatusControllerResponse>;
}

export type CreateStatusControllerParams = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateStatusControllerResponse = {
    success: boolean;
    id?: string;
    error?: string;
};
