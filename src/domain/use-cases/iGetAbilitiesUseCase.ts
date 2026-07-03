import { Ability } from '../entities';

export interface IGetAbilitiesUseCase {
    execute(): Promise<Ability[]>;
}
