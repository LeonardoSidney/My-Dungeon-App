export interface IResendChatUseCase {
    execute (params: ResendChatUseCaseParams): Promise<ResendChatUseCaseReturn>;
}

export type ResendChatUseCaseParams = {
    adventureId: string;
    chatId?: string;
};

export type ResendChatUseCaseReturn = {
    success: boolean;
    error?: string;
};
