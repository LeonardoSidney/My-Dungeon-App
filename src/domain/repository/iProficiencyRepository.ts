import { Proficiency } from '../entities';

export interface IProficiencyRepository {
    saveProficiency (params: SaveProficiencyParams): Promise<SaveProficiencyRepositoryReturn>;
    getProficiencies (): Promise<GetProficienciesRepositoryReturn>;
    getProficiencyById (proficiencyId: string): Promise<GetProficiencyByIdRepositoryReturn>;
    editProficiency (params: EditProficiencyParams): Promise<EditProficiencyReturn>;
    eraseProficiency (proficiencyId: string): Promise<EraseProficiencyReturn>;
}

export type SaveProficiencyParams = {
    proficiency: Proficiency;
};

export type EditProficiencyParams = {
    proficiency: Proficiency;
};

export type SaveProficiencyRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetProficienciesRepositoryReturn = {
    success: boolean;
    proficiencies?: Proficiency[];
    error?: string;
};

export type GetProficiencyByIdRepositoryReturn = {
    success: boolean;
    proficiency?: Proficiency;
    error?: string;
};

export type EditProficiencyReturn = {
    success: boolean;
    error?: string;
};

export type EraseProficiencyReturn = {
    success: boolean;
    error?: string;
};
