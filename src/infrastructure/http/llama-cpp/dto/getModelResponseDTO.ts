export type GetModelResponseDTOMeta = {
    n_ctx: number;
};

export type GetModelResponseDTOStatus = {
    value?: string;
};

export type GetModelResponseDTOEntry = {
    id: string;
    name?: string;
    meta?: GetModelResponseDTOMeta;
    status?: GetModelResponseDTOStatus;
    owned_by: string;
};
