import { EntityOption } from './iCrudControllerResponses';

export type AdventureChatWorldMaster = EntityOption;

export interface IGetAdventureWorldMasterController {
    handle (params: GetAdventureWorldMasterControllerParams): Promise<GetAdventureWorldMasterControllerResponse>;
}

export type GetAdventureWorldMasterControllerParams = {
    adventureId: string;
};

export type GetAdventureWorldMasterControllerResponse = {
    success: boolean;
    data?: AdventureChatWorldMaster | null;
    error?: string;
};
