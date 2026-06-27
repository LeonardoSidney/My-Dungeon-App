import { Proficiency } from "../entities/Proficiency";

export interface IProficiencyRepository {
    saveProficiency(params: SaveProficiencyParams): Promise<boolean>;
    getProficiencies(): Promise<Proficiency[]>;
}

export type SaveProficiencyParams = {
    proficiency: Proficiency;
};
