export interface IEraseLocationController {
    handle (request: EraseLocationControllerRequest): Promise<EraseLocationControllerResponse>;
}

export type EraseLocationControllerResponse = {
    success: boolean;
    error?: string;
};

export type EraseLocationControllerRequest = {
    id: string;
};
