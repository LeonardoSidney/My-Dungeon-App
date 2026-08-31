export interface IEraseStatusController {
    handle (statusId: string): Promise<EraseStatusControllerResponse>;
}

export type EraseStatusControllerResponse = {
    success: boolean;
    error?: string;
};
