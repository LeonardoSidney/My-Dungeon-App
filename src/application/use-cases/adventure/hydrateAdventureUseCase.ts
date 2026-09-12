import { ILogger } from '@domain/logger';
import { IHydrateAdventureService } from '@domain/services';
import {
    HydrateAdventureParams,
    HydrateAdventureReturn,
    IHydrateAdventureUseCase,
} from '@domain/use-cases';

export class HydrateAdventureUseCase implements IHydrateAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly hydrateAdventureService: IHydrateAdventureService
    ) { }

    async execute (params: HydrateAdventureParams): Promise<HydrateAdventureReturn> {
        this.logger.info('Executing HydrateAdventureUseCase::execute');
        this.logger.debug('Executing HydrateAdventureUseCase::execute - params', params);

        try {
            const response = await this.hydrateAdventureService.hydrate(params);

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
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in HydrateAdventureUseCase::execute', error);
                return {
                    success: false,
                    error: error.message,
                };
            }

            this.logger.error('Error in HydrateAdventureUseCase::execute', error);
            return {
                success: false,
                error: 'Hydrate adventure failed',
            };
        }
    }
}
