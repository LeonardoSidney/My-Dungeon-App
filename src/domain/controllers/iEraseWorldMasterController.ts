export type EraseWorldMasterControllerResponse = {
    success: boolean;
    error?: string;
};

export interface IEraseWorldMasterController {
    handle (request: EraseWorldMasterControllerRequest): Promise<EraseWorldMasterControllerResponse>;
}

export type EraseWorldMasterControllerRequest = {
    id: string;
};
