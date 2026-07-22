export type EraseCharacterControllerResponse = {
    success: boolean;
    error?: string;
};

export interface IEraseCharacterController {
    handle (characterId: string): Promise<EraseCharacterControllerResponse>;
}
