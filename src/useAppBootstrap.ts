import { useEffect, useState } from 'react';
import { HOME_DRAFT_ID } from '@domain/constants/draft';
import type { AppControllers } from '@presentation/providers/appControllers';
import { showError } from '@presentation/utils/showError';
import { runSeed, runStorageMigration } from './migration';

export function useAppBootstrap (controllers: AppControllers): boolean {
    const { alert, recoverInterruptedReplies, saveDraft } = controllers;
    const [isStorageReady, setIsStorageReady] = useState(false);

    useEffect(() => {
        const seed = async () => {
            const response = await runSeed();
            if (!response.success) {
                showError(alert, response.error, 'Failed to seed data');
                return;
            }

            if (!response.prompt) {
                return;
            }

            const saved = await saveDraft.handle({ draftId: HOME_DRAFT_ID, content: response.prompt, onlyIfMissing: true });
            if (!saved.success) {
                showError(alert, saved.error, 'Failed to save the initial draft');
            }
        };

        const recoverReplies = async () => {
            const response = await recoverInterruptedReplies.handle();
            if (!response.success) {
                showError(alert, response.error, 'Failed to recover interrupted replies');
            }
        };

        const start = async () => {
            const migrated = await runStorageMigration();
            if (!migrated.success) {
                showError(alert, migrated.error, 'Failed to migrate the stored data');
                return;
            }

            setIsStorageReady(true);
            await seed();
            await recoverReplies();
        };

        start();
    }, [alert, recoverInterruptedReplies, saveDraft]);

    return isStorageReady;
}
