export type EraseWorldControllerResponse = {
    success: boolean;
    error?: string;
};

export interface IEraseWorldController {
    handle (worldId: string): Promise<EraseWorldControllerResponse>;
}
