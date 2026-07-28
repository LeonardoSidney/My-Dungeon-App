import { Adventure, Character, Chat, SystemPrompt, WorldMaster, World, Location, Item } from '@domain/entities';

export interface AdventuresPanelProps {
    adventures: Adventure[];
    onDelete: (adventure: Adventure) => Promise<void>;
}

export type FormErrors = {
    name?: string;
    systemPrompts?: string;
    characters?: string;
};

export type AdventureFormData = {
    id?: string;
    name: string;
    systemPrompts: SystemPrompt[];
    characters: Character[];
    worldMaster?: WorldMaster;
    characterAsWorldMasterId?: string;
    avaliableCharacters: Character[];
    worlds?: World[];
    locations?: Location[];
    items?: Item[];
    chat: Chat[];
    createdAt?: Date;
    updatedAt?: Date;
};
