import type { HomeSummaryView } from '@domain/controllers';
import type { HomeSummary } from '@domain/use-cases';

export interface IGetHomeSummaryPresenter {
    present (summary: HomeSummary): HomeSummaryView;
}
