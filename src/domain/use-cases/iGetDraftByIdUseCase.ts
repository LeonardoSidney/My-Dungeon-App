import { Draft } from '../entities';

export interface IGetDraftByIdUseCase {
    execute (params: GetDraftByIdUseCaseParams): Promise<GetDraftByIdUseCaseReturn>;
}

export type GetDraftByIdUseCaseParams = {
    draftId: string;
};

export type GetDraftByIdUseCaseReturn = {
    success: boolean;
    draft?: Draft;
    error?: string;
};
