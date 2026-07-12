import { IStreamCompletionController, StreamCompletionControllerRequest, StreamCompletionControllerResponse } from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IStreamCompletionUseCase } from '@domain/use-cases';

export class StreamCompletionController implements IStreamCompletionController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: IStreamCompletionUseCase
    ) { }

    async handle(request: StreamCompletionControllerRequest): Promise<StreamCompletionControllerResponse> {
        this.logger.info('Executing StreamCompletionController::handle');
        return this.useCase.execute(request);
    }
}
