export interface IEraseItemController {
    handle (itemId: string): Promise<EraseItemControllerResponse>;
}

export type EraseItemControllerResponse = {
    success: boolean;
    error?: string;
};
