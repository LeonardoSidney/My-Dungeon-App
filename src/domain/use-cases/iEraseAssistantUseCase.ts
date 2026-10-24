export type EraseAssistantUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseAssistantUseCase {
    execute (params: EraseAssistantUseCaseParams): Promise<EraseAssistantUseCaseReturn>;
}

export type EraseAssistantUseCaseParams = {
    id: string;
};
