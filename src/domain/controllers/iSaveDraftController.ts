export interface ISaveDraftController {
    handle (request: SaveDraftControllerRequest): Promise<SaveDraftControllerResponse>;
}

export type SaveDraftControllerRequest = {
    draftId: string;
    content: string;
    onlyIfMissing?: boolean;
};

export type SaveDraftControllerResponse = {
    success: boolean;
    error?: string;
};
