export interface IEraseItemController {
    handle (request: EraseItemControllerRequest): Promise<EraseItemControllerResponse>;
}

export type EraseItemControllerResponse = {
    success: boolean;
    error?: string;
};

export type EraseItemControllerRequest = {
    id: string;
};
