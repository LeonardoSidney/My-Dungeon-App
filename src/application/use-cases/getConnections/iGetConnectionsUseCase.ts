import { Connection } from "../../../domain/entities";

export interface IGetConnectionsUseCase {
    execute(): Promise<Connection[]>;
}
