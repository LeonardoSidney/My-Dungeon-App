import type { Draft } from '../entities';
import type { DraftView } from '../controllers';

export interface IDraftPresenter {
    present (draft: Draft): DraftView;
}
