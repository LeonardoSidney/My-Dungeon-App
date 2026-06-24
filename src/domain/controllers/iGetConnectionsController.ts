import { Connection } from "../entities";

export interface IGetConnectionsController {
    handle(): Promise<Connection[]>;
}
