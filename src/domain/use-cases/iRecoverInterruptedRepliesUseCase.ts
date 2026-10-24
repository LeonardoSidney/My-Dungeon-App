export interface IRecoverInterruptedRepliesUseCase {
    execute (): Promise<RecoverInterruptedRepliesUseCaseReturn>;
}

export type RecoverInterruptedRepliesUseCaseReturn = {
    success: boolean;
    recoveredChatIds?: string[];
    error?: string;
};
