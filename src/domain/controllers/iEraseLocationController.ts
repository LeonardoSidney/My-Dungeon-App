export interface IEraseLocationController {
    handle (locationId: string): Promise<EraseLocationControllerResponse>;
}

export type EraseLocationControllerResponse = {
    success: boolean;
    error?: string;
};
