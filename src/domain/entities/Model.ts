import { Connection } from "./Connection";

export type Model = {
    id: string;
    name: string;
    connection: Connection;
    nCtx: number;
    ownedBy: string;
};
