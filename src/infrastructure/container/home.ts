import { GetHomeSummaryController } from '@adapters/controllers';
import { GetHomeSummaryPresenter } from '@adapters/presenters';
import { ActivitySummaryService } from '@application/services';
import { GetHomeSummaryUseCase } from '@application/use-cases';
import { IGetHomeSummaryController } from '@domain/controllers';
import { logger } from './shared';
import { createGetAbilitiesUseCase } from './ability';
import { createGetAdventuresUseCase } from './adventure';
import { createGetAssistantsUseCase } from './assistant';
import { createGetCharactersUseCase } from './character';
import { createGetConnectionsUseCase } from './connection';
import { createGetItemsUseCase } from './item';
import { createGetLocationsUseCase } from './location';
import { createGetProficienciesUseCase } from './proficiency';
import { createGetSamplersUseCase } from './sampler';
import { createGetStatusesUseCase } from './status';
import { createGetSystemPromptsUseCase } from './systemPrompt';
import { createGetWorldMastersUseCase } from './worldMaster';
import { createGetWorldsUseCase } from './world';

export function getHomeSummaryController (): IGetHomeSummaryController {
    const getAdventuresUseCase = createGetAdventuresUseCase();
    const getCharactersUseCase = createGetCharactersUseCase();
    const getWorldMastersUseCase = createGetWorldMastersUseCase();
    const getWorldsUseCase = createGetWorldsUseCase();
    const getLocationsUseCase = createGetLocationsUseCase();
    const getItemsUseCase = createGetItemsUseCase();
    const getAbilitiesUseCase = createGetAbilitiesUseCase();
    const getProficienciesUseCase = createGetProficienciesUseCase();
    const getStatusesUseCase = createGetStatusesUseCase();
    const getSystemPromptsUseCase = createGetSystemPromptsUseCase();
    const getAssistantsUseCase = createGetAssistantsUseCase();
    const getSamplersUseCase = createGetSamplersUseCase();
    const getConnectionsUseCase = createGetConnectionsUseCase();
    const activitySummaryService = new ActivitySummaryService(logger);
    const getHomeSummaryUseCase = new GetHomeSummaryUseCase(
        logger,
        getAdventuresUseCase,
        getCharactersUseCase,
        getWorldMastersUseCase,
        getWorldsUseCase,
        getLocationsUseCase,
        getItemsUseCase,
        getAbilitiesUseCase,
        getProficienciesUseCase,
        getStatusesUseCase,
        getSystemPromptsUseCase,
        getAssistantsUseCase,
        getSamplersUseCase,
        getConnectionsUseCase,
        activitySummaryService
    );
    return new GetHomeSummaryController(logger, getHomeSummaryUseCase, new GetHomeSummaryPresenter());
}
