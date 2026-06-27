import { Proficiency } from "../entities/Proficiency";

export interface IGetProficienciesController {
    handle(): Promise<Proficiency[]>;
}
