export interface IAppendChatAdventureUseCase {
    execute (params: AppendChatUseCaseParams): Promise<AppendChatUseCaseReturn>;
}

export type AppendChatUseCaseParams = {
    adventureId: string;
    characterId: string;
    content: string;
};

export type AppendChatUseCaseReturn = {
    success: boolean;
    id?: string;
    error?: string;
};
