export type EraseAdventureControllerResponse = {
    success: boolean;
    error?: string;
};

export interface IEraseAdventureController {
    handle (adventureId: string): Promise<EraseAdventureControllerResponse>;
}
