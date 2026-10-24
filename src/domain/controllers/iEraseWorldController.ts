export type EraseWorldControllerResponse = {
    success: boolean;
    error?: string;
};

export interface IEraseWorldController {
    handle (request: EraseWorldControllerRequest): Promise<EraseWorldControllerResponse>;
}

export type EraseWorldControllerRequest = {
    id: string;
};
