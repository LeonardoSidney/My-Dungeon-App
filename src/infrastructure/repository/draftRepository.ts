import { DRAFT_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Draft } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    GetDraftByIdRepositoryReturn,
    GetDraftsReturn,
    IDraftRepository,
    SaveDraftParams,
    SaveDraftRepositoryReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { DraftDTO } from '../dto';

export class DraftRepository implements IDraftRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${DRAFT_STORAGE_NAMESPACE}`;
    }

    private async getDrafts (): Promise<GetDraftsReturn> {
        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('DraftRepository::getDrafts - failed to load drafts', loaded.error);
            return { success: false, error: 'Failed to load drafts' };
        }

        const rawData = loaded.data ?? [];
        if (!Array.isArray(rawData)) {
            this.logger.warning('DraftRepository::getDrafts - stored drafts are not a list');
            return { success: false, error: 'Failed to load drafts' };
        }

        const drafts: Draft[] = [];
        for (const draftUnknown of rawData) {
            const draft = DraftDTO.fromStorage(draftUnknown);
            if (draft) {
                drafts.push(draft.toEntity());
            }
        }

        if (rawData.length !== drafts.length) {
            this.logger.warning('Some drafts were not converted to entity');
        }

        return { success: true, drafts };
    }

    async getDraftById (draftId: string): Promise<GetDraftByIdRepositoryReturn> {
        this.logger.info('Executing DraftRepository::getDraftById');

        const response = await this.getDrafts();
        if (!response.success || !response.drafts) {
            return { success: false, error: response.error };
        }

        return { success: true, draft: response.drafts.find(draft => draft.id === draftId) };
    }

    async saveDraft (params: SaveDraftParams): Promise<SaveDraftRepositoryReturn> {
        this.logger.info('Executing DraftRepository::saveDraft');

        const response = await this.getDrafts();
        if (!response.success || !response.drafts) {
            return { success: false, error: 'Failed to save draft' };
        }

        const drafts = response.drafts.filter(draft => draft.id !== params.draft.id);
        drafts.push(params.draft);

        const saved = await this.storage.save(this.storageKey, drafts);
        if (!saved.success) {
            this.logger.warning('DraftRepository::saveDraft - failed to persist drafts', saved.error);
            return { success: false, error: 'Failed to save draft' };
        }

        return { success: true };
    }
}
