export type EraseAssistantUseCaseReturn = {
    success: boolean;
    error?: string;
};

export interface IEraseAssistantUseCase {
    execute (assistantId: string): Promise<EraseAssistantUseCaseReturn>;
}
