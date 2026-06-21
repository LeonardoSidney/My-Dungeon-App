import { Character } from "./Character";
import { Chat } from "./Chat";
import { Item } from "./Item";
import { Location } from "./Location";
import { SystemPrompt } from "./SystemPrompt";
import { World } from "./World";
import { WorldMaster } from "./WorldMaster";

export type Adventure = {
    id: string;
    name: string;
    chat: Chat[];
    systemPrompt: SystemPrompt[];
    characters: Character[];
    worldMaster?: WorldMaster;
    world?: World;
    location?: Location;
    items?: Item[];
    createdAt: Date;
    updatedAt: Date;
};
