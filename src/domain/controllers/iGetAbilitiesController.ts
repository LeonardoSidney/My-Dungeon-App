import { Ability } from '../entities';

export interface IGetAbilitiesController {
    handle(): Promise<Ability[]>;
}
