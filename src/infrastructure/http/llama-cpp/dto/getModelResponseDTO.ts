import { Connection, Model } from "../../../../domain/entities";

export type GetModelResponseDTOData = {
    aliases: string[];
    created: number;
    id: string;
    meta: {
        n_ctx: number,
        n_ctx_train: number,
        n_embd: number,
        n_params: number,
        n_vocab: number,
        size: number,
        vocab_type: number;
    };
    object: string;
    owned_by: string;
    tags: string[];
};

export type GetModelResponseDTOModels = {
    capabilities: string[];
    description: string;
    details: {
        families: string[];
        family: string;
        format: string;
        parameter_size: string;
        parent_model: string;
        quantization_level: string;
    };
    digest: string;
    model: string;
    modified_at: string;
    name: string;
    parameters: string;
    size: string;
    tags: string[];
    type: string;
};


export class GetModelResponseDTO {
    public data: GetModelResponseDTOData[];
    public models: GetModelResponseDTOModels[];

    constructor(data: GetModelResponseDTOData[], models: GetModelResponseDTOModels[]) {
        this.data = data;
        this.models = models;
    }

    toEntity(connection: Connection): Model[] {
        const models: Model[] = [];
        for (let i = 0; i < this.models.length; i++) {
            const data = this.data[i];
            const model = this.models[i];

            models.push({
                id: data.id,
                name: model.name.split('/').pop() ?? 'Unknown',
                connection,
                nCtx: data.meta.n_ctx,
                ownedBy: data.owned_by
            });
        }

        return models;
    }
}
