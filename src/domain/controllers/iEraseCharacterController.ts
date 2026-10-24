export type EraseCharacterControllerResponse = {
    success: boolean;
    error?: string;
};

export interface IEraseCharacterController {
    handle (request: EraseCharacterControllerRequest): Promise<EraseCharacterControllerResponse>;
}

export type EraseCharacterControllerRequest = {
    id: string;
};
