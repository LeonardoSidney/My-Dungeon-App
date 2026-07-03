import { Assistant } from '../entities';

export interface IGetAssistantsUseCase {
    execute(): Promise<Assistant[]>;
}
