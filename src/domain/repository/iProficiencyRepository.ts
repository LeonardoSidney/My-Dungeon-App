import { Proficiency } from '../entities';

export interface IProficiencyRepository {
    saveProficiency (params: SaveProficiencyParams): Promise<boolean>;
    getProficiencies (): Promise<Proficiency[]>;
    editProficiency (params: EditProficiencyParams): Promise<EditProficiencyReturn>;
    eraseProficiency (proficiencyId: string): Promise<EraseProficiencyReturn>;
}

export type SaveProficiencyParams = {
    proficiency: Proficiency;
};

export type EditProficiencyParams = {
    proficiency: Proficiency;
};

export type EditProficiencyReturn = {
    success: boolean;
    error?: string;
};

export type EraseProficiencyReturn = {
    success: boolean;
    error?: string;
};
