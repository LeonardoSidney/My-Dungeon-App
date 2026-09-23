import {
    INativeStreamCompletionController,
    NativeStreamCompletionControllerRequest,
    NativeStreamCompletionControllerResponse,
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { INativeStreamCompletionUseCase } from '@domain/use-cases';

export class NativeStreamCompletionController implements INativeStreamCompletionController {
    constructor (
        private readonly logger: ILogger,
        private readonly useCase: INativeStreamCompletionUseCase
    ) { }

    async handle (request: NativeStreamCompletionControllerRequest): Promise<NativeStreamCompletionControllerResponse> {
        this.logger.info('Executing NativeStreamCompletionController::handle');
        this.logger.debug('NativeStreamCompletionController::handle - request', {
            adventureId: request.adventureId,
            connectionId: request.connectionId,
            samplerId: request.samplerId,
            modelId: request.modelId,
        });

        const result = await this.useCase.execute(request);

        return {
            success: result.success,
            stream: result.stream,
            abort: result.abort,
            error: result.error,
        };
    }
}
