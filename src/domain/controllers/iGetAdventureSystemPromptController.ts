import { Adventure } from '../entities';

export interface IGetAdventureSystemPromptController {
    handle (params: GetAdventureSystemPromptControllerParams): Promise<GetAdventureSystemPromptControllerResponse>;
}

export type GetAdventureSystemPromptControllerParams = {
    adventure: Adventure;
};

export type GetAdventureSystemPromptControllerResponse = {
    success: boolean;
    systemPrompt?: string;
    error?: string;
};
