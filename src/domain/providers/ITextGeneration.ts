import { Chat } from '@domain/entities';
import type { ModelProviderGateway } from '@domain/gateways';
import type { TurnSpeaker } from '@domain/services';
import { HydratedAdventure } from '@domain/use-cases';

export interface ITextGeneration {
    buildAdventureTextSystemPrompt (hydrated: HydratedAdventure, loadOrder: string): BuildAdventureTextSystemPromptReturn;
    buildAdventureTurnMessages (params: BuildAdventureTurnMessagesParams): BuildAdventureTurnMessagesReturn;
}

export const UNKNOWN_CHARACTER_NAME = 'Unknown';

export enum TurnPromptPurposeEnum {
    REPLY = 'reply',
    CONTEXT = 'context',
}

export type TurnPromptPurpose = TurnPromptPurposeEnum.REPLY | TurnPromptPurposeEnum.CONTEXT;

export type BuildAdventureTurnMessagesParams = {
    hydrated: HydratedAdventure;
    speaker: TurnSpeaker;
    purpose: TurnPromptPurpose;
    context?: string;
    targetChatId?: string;
};

export type BuildAdventureTurnMessagesReturn = {
    success: boolean;
    messages?: ModelProviderGateway.TemplateMessage[];
    error?: string;
};

export type TurnMessageTemplates = {
    message: string;
    contextMessage: string;
    turnMessage: string;
    characterMessage: string;
    instructionsMessage: string;
    aiCharacterInstruction: string;
    worldMasterInstruction: string;
    contextInstruction: string;
};

export type ResolveTurnTemplatesReturn = {
    success: boolean;
    templates?: TurnMessageTemplates;
    error?: string;
};

export type TurnChats = {
    history: Chat[];
    target?: Chat;
};

export type TurnHistory = {
    messages: ModelProviderGateway.TemplateMessage[];
    currentTurn: Chat[];
};

export type TemplateTagValues = Map<string, string>;

export type BuildAdventureTextSystemPromptReturn = {
    success: boolean;
    systemPrompt?: string;
    error?: string;
};

export type AdventureTemplates = {
    systemPrompt: string;
    worldMaster: string;
    iaControlledCharacter: string;
    worlds: string;
    locations: string;
    items: string;
    abilities: string;
    proficiencies: string;
    statuses: string;
    characters: string;
};

export type LoadOrderSections = TemplateTagValues;

export type EnabledCharacterReferences = {
    abilities: boolean;
    proficiencies: boolean;
    statuses: boolean;
};

export type ResolveTemplatesReturn = {
    success: boolean;
    templates?: AdventureTemplates;
    error?: string;
};
