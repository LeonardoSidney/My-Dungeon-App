import {
    IStreamCompletionController,
    StreamCompletionControllerRequest,
    StreamCompletionControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IStreamCompletionUseCase } from '@domain/use-cases';

export class StreamCompletionController implements IStreamCompletionController {
    constructor (private readonly logger: ILogger, private readonly useCase: IStreamCompletionUseCase) {}

    async handle (request: StreamCompletionControllerRequest): Promise<StreamCompletionControllerResponse> {
        this.logger.info('Executing StreamCompletionController::handle');
        const result = await this.useCase.execute(request);
        return {
            success: result.success,
            stream: result.stream,
            abort: result.abort,
            error: result.error,
        };
    }
}
