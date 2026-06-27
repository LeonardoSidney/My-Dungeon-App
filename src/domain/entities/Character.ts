import { Ability } from "./Ability";
import { Assistant } from "./Assistant";
import { Atribbute } from "./Attribute";
import { Proficiency } from "./Proficiency";
import { Status } from "./Status";

export type Character = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    abilities?: Ability;
    proficiencies?: Proficiency;
    status?: Status;
    attributes?: Atribbute[];
    assistant: Assistant;
    createdAt: Date;
    updatedAt: Date;
};
