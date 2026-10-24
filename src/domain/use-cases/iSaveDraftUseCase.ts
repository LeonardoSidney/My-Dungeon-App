export interface ISaveDraftUseCase {
    execute (params: SaveDraftUseCaseParams): Promise<SaveDraftUseCaseReturn>;
}

export type SaveDraftUseCaseParams = {
    draftId: string;
    content: string;
    onlyIfMissing?: boolean;
};

export type SaveDraftUseCaseReturn = {
    success: boolean;
    error?: string;
};
