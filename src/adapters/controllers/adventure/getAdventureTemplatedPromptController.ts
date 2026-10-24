import {
    GetAdventureTemplatedPromptControllerParams,
    GetAdventureTemplatedPromptControllerResponse,
    IGetAdventureTemplatedPromptController,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IGetAdventureTemplatedPromptUseCase } from '@domain/use-cases';

export class GetAdventureTemplatedPromptController implements IGetAdventureTemplatedPromptController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: IGetAdventureTemplatedPromptUseCase
    ) { }

    async handle (params: GetAdventureTemplatedPromptControllerParams): Promise<GetAdventureTemplatedPromptControllerResponse> {
        this.logger.info('Executing GetAdventureTemplatedPromptController::handle');
        this.logger.debug('GetAdventureTemplatedPromptController::handle - params', params);

        const response = await this.useCase.execute({ adventureId: params.adventureId });

        return {
            success: response.success,
            data: response.prompt,
            error: response.error,
        };
    }
}
