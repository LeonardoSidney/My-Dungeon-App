import { Character } from '../entities';

export interface IGetCharactersUseCase {
    execute(): Promise<Character[]>;
}
