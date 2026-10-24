export interface IStopChatReplyUseCase {
    execute (params: StopChatReplyUseCaseParams): StopChatReplyUseCaseReturn;
}

export type StopChatReplyUseCaseParams = {
    adventureId: string;
};

export type StopChatReplyUseCaseReturn = {
    success: boolean;
    error?: string;
};
