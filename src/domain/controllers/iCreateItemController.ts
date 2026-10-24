
export interface ICreateItemController {
    handle(request: CreateItemRequest): Promise<CreateItemResponse>;
}

export type CreateItemRequest = {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
};

export type CreateItemResponse = {
    success: boolean;
    id?: string;
    error?: string;
};
