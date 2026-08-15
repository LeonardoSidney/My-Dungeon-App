import { Connection, Model } from '@domain/entities';

export const DEFAULT_CONTEXT_SIZE = 4096;

export type GetModelResponseDTOMeta = {
    n_ctx: number;
    n_ctx_train: number;
    n_embd: number;
    n_params: number;
    n_vocab: number;
    size: number;
    vocab_type: number;
};

export type GetModelResponseDTOArchitecture = {
    input_modalities: string[];
    output_modalities: string[];
};

export type GetModelResponseDTOEntry = {
    id: string;
    name?: string;
    meta?: GetModelResponseDTOMeta;
    architecture?: GetModelResponseDTOArchitecture;
    owned_by: string;
};

export class GetModelResponseDTO {
    constructor (readonly entries: GetModelResponseDTOEntry[]) { }

    toEntity (connection: Connection): Model[] {
        return this.entries.map(entry => {
            return {
                id: entry.id,
                name: entry.name ?? this.fallbackName(entry.id),
                connection,
                nCtx: entry.meta?.n_ctx ?? DEFAULT_CONTEXT_SIZE,
                ownedBy: entry.owned_by
            };
        });
    }

    private fallbackName (id: string): string {
        const segments = id.split('/');
        return segments[segments.length - 1];
    }
}
