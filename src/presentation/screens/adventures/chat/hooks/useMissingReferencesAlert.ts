import { useEffect } from 'react';
import { IAlertController } from '@domain/controllers';

export function useMissingReferencesAlert (issues: string[], alert: IAlertController): void {
    const issuesText = issues.join('\n');

    useEffect(() => {
        if (!issuesText) {
            return;
        }

        alert.handle({
            title: 'Adventure needs fixing',
            message: `You can read this adventure, but sending messages is disabled until these are fixed:\n\n${issuesText}`,
        });
    }, [issuesText, alert]);
}
