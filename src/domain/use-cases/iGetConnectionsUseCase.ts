import { Connection } from '../entities';

export interface IGetConnectionsUseCase {
    execute(): Promise<Connection[]>;
}
