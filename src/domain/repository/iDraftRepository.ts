import { Draft } from '../entities';

export interface IDraftRepository {
    getDraftById (draftId: string): Promise<GetDraftByIdRepositoryReturn>;
    saveDraft (params: SaveDraftParams): Promise<SaveDraftRepositoryReturn>;
}

export type GetDraftByIdRepositoryReturn = {
    success: boolean;
    draft?: Draft;
    error?: string;
};

export type SaveDraftParams = {
    draft: Draft;
};

export type SaveDraftRepositoryReturn = {
    success: boolean;
    error?: string;
};

export type GetDraftsReturn = {
    success: boolean;
    drafts?: Draft[];
    error?: string;
};
