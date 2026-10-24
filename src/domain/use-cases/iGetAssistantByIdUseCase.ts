import { Assistant } from '../entities';

export interface IGetAssistantByIdUseCase {
    execute (params: GetAssistantByIdUseCaseParams): Promise<GetAssistantByIdUseCaseReturn>;
}

export type GetAssistantByIdUseCaseParams = {
    id: string;
};

export type GetAssistantByIdUseCaseReturn = {
    success: boolean;
    assistant?: Assistant;
    error?: string;
};
