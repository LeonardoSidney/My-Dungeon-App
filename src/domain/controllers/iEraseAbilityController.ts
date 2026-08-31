export interface IEraseAbilityController {
    handle (abilityId: string): Promise<EraseAbilityControllerResponse>;
}

export type EraseAbilityControllerResponse = {
    success: boolean;
    error?: string;
};
