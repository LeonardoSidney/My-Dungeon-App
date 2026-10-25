import { useEffect } from 'react';
import { HOME_DRAFT_ID } from '@domain/constants/draft';
import type { AppControllers } from '@presentation/providers/appControllers';
import { showError } from '@presentation/utils/showError';
import { runSeed } from './migration';

/** Seeds the first-run data and resumes the chat replies an app restart interrupted. */
export function useAppBootstrap (controllers: AppControllers): void {
    const { alert, recoverInterruptedReplies, saveDraft } = controllers;

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

        seed().then(recoverReplies);
    }, [alert, recoverInterruptedReplies, saveDraft]);
}
