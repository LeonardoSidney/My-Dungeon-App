export type EraseConnectionControllerResponse = {
    success: boolean;
    error?: string;
};

export interface IEraseConnectionController {
    handle (request: EraseConnectionControllerRequest): Promise<EraseConnectionControllerResponse>;
}

export type EraseConnectionControllerRequest = {
    id: string;
};
