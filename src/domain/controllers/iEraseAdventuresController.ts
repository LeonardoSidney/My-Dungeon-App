export interface IEraseAdventuresController {
    handle(): Promise<EraseAdventuresControllerResponse>;
}

export type EraseAdventuresControllerResponse = {
    success: boolean;
    error?: string;
};
