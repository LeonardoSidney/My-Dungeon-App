import { Adventure } from '@domain/entities';

export interface IPromptBuilderService {
    buildAdventurePrompt(params: IPromptBuilderService.BuildAdventurePrompt): string;
}

export namespace IPromptBuilderService {
    export type BuildAdventurePrompt = {
        adventure: Adventure;
    };
}
