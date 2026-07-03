import { Proficiency } from '../entities';

export interface IGetProficienciesUseCase {
    execute(): Promise<Proficiency[]>;
}
