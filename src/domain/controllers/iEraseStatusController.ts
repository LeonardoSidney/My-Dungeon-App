export interface IEraseStatusController {
    handle (statusId: string): Promise<EraseStatusControllerResponse>;
}

export type EraseStatusControllerParams = string;

export type EraseStatusControllerResponse = {
    success: boolean;
    error?: string;
};
