import {
    IIsAdventureStreamingController,
    IsAdventureStreamingControllerRequest,
    IsAdventureStreamingControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IIsAdventureStreamingUseCase } from '@domain/use-cases';

export class IsAdventureStreamingController implements IIsAdventureStreamingController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IIsAdventureStreamingUseCase
    ) {}

    async handle (request: IsAdventureStreamingControllerRequest): Promise<IsAdventureStreamingControllerResponse> {
        this.logger.info('Executing IsAdventureStreamingController::handle');
        this.logger.debug('IsAdventureStreamingController::handle - request', request);

        const response = await this.useCase.execute({
            adventure: request.adventure,
        });

        return {
            success: response.success,
            isStreaming: response.isStreaming,
        };
    }
}
