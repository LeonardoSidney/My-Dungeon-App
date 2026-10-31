import { GetSceneContextEnabledControllerResponse, IGetSceneContextEnabledController } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetSceneContextEnabledUseCase } from '@domain/use-cases';

export class GetSceneContextEnabledController implements IGetSceneContextEnabledController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetSceneContextEnabledUseCase
    ) { }

    async handle (): Promise<GetSceneContextEnabledControllerResponse> {
        this.logger.info('Executing GetSceneContextEnabledController::handle');
        return this.useCase.execute();
    }
}
