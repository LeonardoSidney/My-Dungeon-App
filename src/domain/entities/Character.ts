import { Ability } from "./Ability";
import { Atribbute } from "./Attribute";
import { Status } from "./Status";

export type Character = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    abilities?: Ability;
    status?: Status;
    attributes?: Atribbute[];
    createdAt: Date;
    updatedAt: Date;
};
