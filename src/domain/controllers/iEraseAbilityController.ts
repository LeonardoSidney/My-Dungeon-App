export interface IEraseAbilityController {
    handle (request: EraseAbilityControllerRequest): Promise<EraseAbilityControllerResponse>;
}

export type EraseAbilityControllerResponse = {
    success: boolean;
    error?: string;
};

export type EraseAbilityControllerRequest = {
    id: string;
};
