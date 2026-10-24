import type { Draft } from '@domain/entities';
import type { DraftView } from '@domain/controllers';
import { IDraftPresenter } from '@domain/presenters';

export class DraftPresenter implements IDraftPresenter {
    present (draft: Draft): DraftView {
        return { id: draft.id, content: draft.content };
    }
}
