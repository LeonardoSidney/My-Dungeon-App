import { Character } from '../entities';

export interface IGetCharactersController {
    handle(): Promise<Character[]>;
}
