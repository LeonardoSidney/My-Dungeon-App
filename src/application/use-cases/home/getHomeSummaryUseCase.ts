import { ILogger } from '@domain/logger';
import { IActivitySummaryService } from '@domain/services';
import {
    GetHomeSummaryUseCaseParams,
    GetHomeSummaryUseCaseReturn,
    HomeSummaryListResponse,
    IGetAbilitiesUseCase,
    IGetAdventuresUseCase,
    IGetAssistantsUseCase,
    IGetCharactersUseCase,
    IGetConnectionsUseCase,
    IGetHomeSummaryUseCase,
    IGetItemsUseCase,
    IGetLocationsUseCase,
    IGetProficienciesUseCase,
    IGetSamplersUseCase,
    IGetStatusesUseCase,
    IGetSystemPromptsUseCase,
    IGetWorldMastersUseCase,
    IGetWorldsUseCase,
} from '@domain/use-cases';

export class GetHomeSummaryUseCase implements IGetHomeSummaryUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly getAdventuresUseCase: IGetAdventuresUseCase,
        private readonly getCharactersUseCase: IGetCharactersUseCase,
        private readonly getWorldMastersUseCase: IGetWorldMastersUseCase,
        private readonly getWorldsUseCase: IGetWorldsUseCase,
        private readonly getLocationsUseCase: IGetLocationsUseCase,
        private readonly getItemsUseCase: IGetItemsUseCase,
        private readonly getAbilitiesUseCase: IGetAbilitiesUseCase,
        private readonly getProficienciesUseCase: IGetProficienciesUseCase,
        private readonly getStatusesUseCase: IGetStatusesUseCase,
        private readonly getSystemPromptsUseCase: IGetSystemPromptsUseCase,
        private readonly getAssistantsUseCase: IGetAssistantsUseCase,
        private readonly getSamplersUseCase: IGetSamplersUseCase,
        private readonly getConnectionsUseCase: IGetConnectionsUseCase,
        private readonly activitySummaryService: IActivitySummaryService
    ) { }

    async execute (params: GetHomeSummaryUseCaseParams = {}): Promise<GetHomeSummaryUseCaseReturn> {
        this.logger.info('Executing GetHomeSummaryUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const [
            adventures,
            characters,
            worldMasters,
            worlds,
            locations,
            items,
            abilities,
            proficiencies,
            statuses,
            systemPrompts,
            assistants,
            samplers,
            connections,
        ] = await Promise.all([
            this.getAdventuresUseCase.execute(),
            this.getCharactersUseCase.execute(),
            this.getWorldMastersUseCase.execute(),
            this.getWorldsUseCase.execute(),
            this.getLocationsUseCase.execute(),
            this.getItemsUseCase.execute(),
            this.getAbilitiesUseCase.execute(),
            this.getProficienciesUseCase.execute(),
            this.getStatusesUseCase.execute(),
            this.getSystemPromptsUseCase.execute(),
            this.getAssistantsUseCase.execute(),
            this.getSamplersUseCase.execute(),
            this.getConnectionsUseCase.execute(),
        ]);

        const failedError = this.findFailure([
            adventures,
            characters,
            worldMasters,
            worlds,
            locations,
            items,
            abilities,
            proficiencies,
            statuses,
            systemPrompts,
            assistants,
            samplers,
            connections,
        ]);
        if (failedError) {
            this.logger.warning('GetHomeSummaryUseCase::execute - failed to load the catalog', failedError);
            return { success: false, error: failedError };
        }

        const adventureList = adventures.adventures ?? [];
        const characterList = characters.characters ?? [];
        const activity = this.activitySummaryService.summarize({
            adventures: adventureList,
            characters: characterList,
            now: params.now ?? new Date(),
        });

        return {
            success: true,
            summary: {
                counts: {
                    adventures: adventureList.length,
                    characters: characterList.length,
                    worldMasters: worldMasters.worldMasters?.length ?? 0,
                    worlds: worlds.worlds?.length ?? 0,
                    locations: locations.locations?.length ?? 0,
                    items: items.items?.length ?? 0,
                    abilities: abilities.abilities?.length ?? 0,
                    proficiencies: proficiencies.proficiencies?.length ?? 0,
                    statuses: statuses.statuses?.length ?? 0,
                    systemPrompts: systemPrompts.systemPrompts?.length ?? 0,
                    assistants: assistants.assistants?.length ?? 0,
                    samplers: samplers.samplers?.length ?? 0,
                    connections: connections.connections?.length ?? 0,
                },
                activity,
            },
        };
    }

    private validate (params: GetHomeSummaryUseCaseParams): string | null {
        if (params.now && Number.isNaN(params.now.getTime())) {
            return 'A valid date is required to summarize the activity';
        }

        return null;
    }

    private findFailure (responses: HomeSummaryListResponse[]): string | null {
        const failed = responses.find(response => !response.success);
        if (!failed) {
            return null;
        }
        return failed.error ?? 'Failed to load the home summary';
    }
}
