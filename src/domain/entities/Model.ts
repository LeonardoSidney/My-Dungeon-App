import { Connection } from "./Connection";

export type Model = {
    name: string;
    connection: Connection;
    createdAt: Date;
    updatedAt: Date;
};
