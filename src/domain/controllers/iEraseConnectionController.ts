export type EraseConnectionControllerResponse = {
    success: boolean;
    error?: string;
};

export interface IEraseConnectionController {
    handle(connectionId: string): Promise<EraseConnectionControllerResponse>;
}
