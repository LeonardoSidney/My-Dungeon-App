import { MutationControllerResponse } from './iCrudControllerResponses';

export interface IAppendChatAdventureController {
    handle (request: AppendChatControllerRequest): Promise<AppendChatControllerResponse>;
}

export type AppendChatControllerRequest = {
    adventureId: string;
    characterId: string;
    content: string;
};

export type AppendChatControllerResponse = MutationControllerResponse;
