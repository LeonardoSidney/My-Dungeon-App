import { Ability } from "../entities/Ability";

export interface IGetAbilitiesUseCase {
    execute(): Promise<Ability[]>;
}
