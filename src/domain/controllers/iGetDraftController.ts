import type { DraftView } from './iDraftView';

export interface IGetDraftController {
    handle (request: GetDraftControllerRequest): Promise<GetDraftControllerResponse>;
}

export type GetDraftControllerRequest = {
    draftId: string;
};

export type GetDraftControllerResponse = {
    success: boolean;
    draft?: DraftView;
    error?: string;
};
