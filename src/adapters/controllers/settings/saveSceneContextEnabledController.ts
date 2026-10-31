import {
    ISaveSceneContextEnabledController,
    SaveSceneContextEnabledControllerRequest,
    SaveSceneContextEnabledControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ISaveSceneContextEnabledUseCase } from '@domain/use-cases';

export class SaveSceneContextEnabledController implements ISaveSceneContextEnabledController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ISaveSceneContextEnabledUseCase
    ) { }

    async handle (request: SaveSceneContextEnabledControllerRequest): Promise<SaveSceneContextEnabledControllerResponse> {
        this.logger.info('Executing SaveSceneContextEnabledController::handle');
        this.logger.debug('SaveSceneContextEnabledController::handle - params', request);
        return this.useCase.execute(request);
    }
}
