import { Connection } from "../../../domain/entities";

export interface IGetConnectionsController {
    handle(): Promise<Connection[]>;
}
