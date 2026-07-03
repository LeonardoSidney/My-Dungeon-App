import { Proficiency } from '../entities';

export interface IGetProficienciesController {
    handle(): Promise<Proficiency[]>;
}
