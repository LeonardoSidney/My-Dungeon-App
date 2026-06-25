import { Assistant } from "../entities";

export interface IGetAssistantsController {
    handle(): Promise<Assistant[]>;
}
