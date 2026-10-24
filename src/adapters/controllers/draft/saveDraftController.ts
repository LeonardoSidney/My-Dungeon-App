import { ISaveDraftController, SaveDraftControllerRequest, SaveDraftControllerResponse } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { ISaveDraftUseCase } from '@domain/use-cases';

export class SaveDraftController implements ISaveDraftController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: ISaveDraftUseCase
    ) { }

    async handle (request: SaveDraftControllerRequest): Promise<SaveDraftControllerResponse> {
        this.logger.info('Executing SaveDraftController::handle');
        this.logger.debug('SaveDraftController::handle - params', { draftId: request.draftId, onlyIfMissing: request.onlyIfMissing });

        return this.useCase.execute(request);
    }
}
