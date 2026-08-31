import { HydratedAdventure } from '@domain/use-cases';

export interface ITextGeneration {
    buildAdventureTextSystemPrompt (hydrated: HydratedAdventure): string;
}
