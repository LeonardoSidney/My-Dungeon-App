export type GetModelResponseDTOMeta = {
    n_ctx: number;
};

export type GetModelResponseDTOEntry = {
    id: string;
    name?: string;
    meta?: GetModelResponseDTOMeta;
    owned_by: string;
};
