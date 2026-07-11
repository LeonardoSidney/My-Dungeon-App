import { Adventure } from '@domain/entities';

export interface ITextGeneration {
    buildAdventureTextSystemPrompt(adventure: Adventure): string;
}
