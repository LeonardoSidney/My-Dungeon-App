export type EraseWorldMasterControllerResponse = {
    success: boolean;
    error?: string;
};

export interface IEraseWorldMasterController {
    handle (worldMasterId: string): Promise<EraseWorldMasterControllerResponse>;
}
