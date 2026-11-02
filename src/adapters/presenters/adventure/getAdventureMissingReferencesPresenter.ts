import type { MissingReference } from '@domain/entities';
import {
    IGetAdventureMissingReferencesPresenter,
    MISSING_REFERENCE_KIND_LABELS,
    MISSING_REFERENCE_OWNER_LABELS,
} from '@domain/presenters';

export class GetAdventureMissingReferencesPresenter implements IGetAdventureMissingReferencesPresenter {
    present (missingReferences: MissingReference[]): string[] {
        const issues = missingReferences.map((reference) => this.toIssue(reference));
        return [...new Set(issues)];
    }

    private toIssue ({ owner, ownerName, kind }: MissingReference): string {
        return `${MISSING_REFERENCE_OWNER_LABELS[owner]} > ${ownerName}: an entry from ${MISSING_REFERENCE_KIND_LABELS[kind]} is no longer available`;
    }
}
