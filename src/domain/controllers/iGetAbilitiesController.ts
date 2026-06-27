import { Ability } from "../entities/Ability";

export interface IGetAbilitiesController {
    handle(): Promise<Ability[]>;
}
