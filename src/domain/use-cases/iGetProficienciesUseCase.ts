import { Proficiency } from "../entities/Proficiency";

export interface IGetProficienciesUseCase {
    execute(): Promise<Proficiency[]>;
}
