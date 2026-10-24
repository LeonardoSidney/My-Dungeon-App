export type EraseAdventureControllerResponse = {
    success: boolean;
    error?: string;
};

export interface IEraseAdventureController {
    handle (request: EraseAdventureControllerRequest): Promise<EraseAdventureControllerResponse>;
}

export type EraseAdventureControllerRequest = {
    id: string;
};
