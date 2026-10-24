import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IHydrateAdventureService } from '@domain/services';
import {
    HydrateAdventureParams,
    HydrateAdventureReturn,
    IHydrateAdventureUseCase,
} from '@domain/use-cases';

export class HydrateAdventureUseCase implements IHydrateAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository,
        private readonly hydrateAdventureService: IHydrateAdventureService
    ) { }

    async execute (params: HydrateAdventureParams): Promise<HydrateAdventureReturn> {
        this.logger.info('Executing HydrateAdventureUseCase::execute');
        this.logger.debug('Executing HydrateAdventureUseCase::execute - params', params);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('HydrateAdventureUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return {
                success: false,
                error: `Adventure with id ${params.adventureId} not found`,
            };
        }

        const response = await this.hydrateAdventureService.hydrate({ adventure });

        if (!response.success) {
            this.logger.warning('HydrateAdventureUseCase::execute - hydration failed', response.error);
            return {
                success: false,
                error: response.error ?? 'Failed to hydrate adventure',
            };
        }

        return {
            success: true,
            hydrated: response.hydrated,
        };
    }

    private validate (params: HydrateAdventureParams): string | null {
        if (!params.adventureId.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }
}
