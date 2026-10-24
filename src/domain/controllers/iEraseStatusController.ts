export interface IEraseStatusController {
    handle (request: EraseStatusControllerRequest): Promise<EraseStatusControllerResponse>;
}

export type EraseStatusControllerResponse = {
    success: boolean;
    error?: string;
};

export type EraseStatusControllerRequest = {
    id: string;
};
