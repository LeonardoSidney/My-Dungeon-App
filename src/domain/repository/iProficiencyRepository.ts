import { Proficiency } from '../entities';

export interface IProficiencyRepository {
    saveProficiency(params: SaveProficiencyParams): Promise<boolean>;
    getProficiencies(): Promise<Proficiency[]>;
}

export type SaveProficiencyParams = {
    proficiency: Proficiency;
};
