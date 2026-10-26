import { ConnectionListItem, HomeSummaryView, ModelOption } from '@domain/controllers';
import type { MenuRoute } from '@presentation/navigation/routes';

export enum CatalogEntityEnum {
    ADVENTURES = 'adventures',
    CHARACTERS = 'characters',
    WORLD_MASTERS = 'worldMasters',
    WORLDS = 'worlds',
    LOCATIONS = 'locations',
    ITEMS = 'items',
    ABILITIES = 'abilities',
    PROFICIENCIES = 'proficiencies',
    STATUSES = 'statuses',
    SYSTEM_PROMPTS = 'systemPrompts',
    ASSISTANTS = 'assistants',
    SAMPLERS = 'samplers',
    CONNECTIONS = 'connections',
}

export type CatalogEntity =
    | CatalogEntityEnum.ADVENTURES
    | CatalogEntityEnum.CHARACTERS
    | CatalogEntityEnum.WORLD_MASTERS
    | CatalogEntityEnum.WORLDS
    | CatalogEntityEnum.LOCATIONS
    | CatalogEntityEnum.ITEMS
    | CatalogEntityEnum.ABILITIES
    | CatalogEntityEnum.PROFICIENCIES
    | CatalogEntityEnum.STATUSES
    | CatalogEntityEnum.SYSTEM_PROMPTS
    | CatalogEntityEnum.ASSISTANTS
    | CatalogEntityEnum.SAMPLERS
    | CatalogEntityEnum.CONNECTIONS;

export type CatalogCounts = HomeSummaryView['counts'];

export enum SetupStepEnum {
    CONNECTION = 'connection',
    ASSISTANT = 'assistant',
    NARRATOR = 'narrator',
    CHARACTER = 'character',
    SYSTEM_PROMPT = 'systemPrompt',
    ADVENTURE = 'adventure',
}

export type SetupStepId =
    | SetupStepEnum.CONNECTION
    | SetupStepEnum.ASSISTANT
    | SetupStepEnum.NARRATOR
    | SetupStepEnum.CHARACTER
    | SetupStepEnum.SYSTEM_PROMPT
    | SetupStepEnum.ADVENTURE;

export type SetupStep = {
    id: SetupStepId;
    label: string;
    route: MenuRoute;
    isDone: boolean;
};

export type ServerStatus = {
    id: string;
    name: string;
    modelCount: number;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function buildSetupSteps (counts: CatalogCounts): SetupStep[] {
    const hasNarrator = counts[CatalogEntityEnum.WORLD_MASTERS] > 0 || counts[CatalogEntityEnum.CHARACTERS] > 0;

    return [
        { id: SetupStepEnum.CONNECTION, label: 'Connect a server', route: 'settings', isDone: counts[CatalogEntityEnum.CONNECTIONS] > 0 },
        { id: SetupStepEnum.ASSISTANT, label: 'Create an assistant', route: 'assistants', isDone: counts[CatalogEntityEnum.ASSISTANTS] > 0 },
        { id: SetupStepEnum.NARRATOR, label: 'Create a world master or a character', route: 'worldMasters', isDone: hasNarrator },
        { id: SetupStepEnum.CHARACTER, label: 'Create a character to play', route: 'characters', isDone: counts[CatalogEntityEnum.CHARACTERS] > 0 },
        { id: SetupStepEnum.SYSTEM_PROMPT, label: 'Write a system prompt', route: 'systemPrompts', isDone: counts[CatalogEntityEnum.SYSTEM_PROMPTS] > 0 },
        { id: SetupStepEnum.ADVENTURE, label: 'Start an adventure', route: 'adventures', isDone: counts[CatalogEntityEnum.ADVENTURES] > 0 },
    ];
}

export function summarizeServers (connections: ConnectionListItem[], models: ModelOption[]): ServerStatus[] {
    return connections.map(connection => ({
        id: connection.id,
        name: connection.name,
        modelCount: models.filter(model => model.connectionId === connection.id).length,
    }));
}

export function formatCount (value: number): string {
    if (value < 1000) {
        return String(value);
    }
    return `${(value / 1000).toFixed(1)}k`;
}

export function formatDaysAgo (dateIso: string, now: Date = new Date()): string {
    const days = Math.floor((now.getTime() - new Date(dateIso).getTime()) / DAY_IN_MS);
    if (days <= 0) {
        return 'today';
    }
    if (days === 1) {
        return 'yesterday';
    }
    return `${days} days ago`;
}
