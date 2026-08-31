import {
    IHydrateAdventureController,
    HydrateAdventureControllerRequest,
    HydrateAdventureControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IHydrateAdventureUseCase } from '@domain/use-cases';

export class HydrateAdventureController implements IHydrateAdventureController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IHydrateAdventureUseCase
    ) { }

    async handle (request: HydrateAdventureControllerRequest): Promise<HydrateAdventureControllerResponse> {
        this.logger.info('Executing HydrateAdventureController::handle');
        const response = await this.useCase.execute(request);

        return {
            success: response.success,
            hydrated: response.hydrated,
            error: response.error
        };
    }
}
