import { GetModelResponseDTO } from "../../infrastructure/http/llama-cpp/dto/getModelResponseDTO";
import { Connection } from "../entities";

export interface IModelProviderGateway {
    getModels(connection: Connection): Promise<GetModelResponseDTO| null>;
}
