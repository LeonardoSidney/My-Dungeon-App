import { DEFAULT_SAMPLER } from '@domain/constants/sampler';
import { ILogger } from '@domain/logger';
import {
    IListModelsUseCase,
    IStreamCompletionUseCase,
    IStreamPromptCompletionUseCase,
    StreamPromptCompletionUseCaseParams,
    StreamPromptCompletionUseCaseResponse,
} from '@domain/use-cases';

export class StreamPromptCompletionUseCase implements IStreamPromptCompletionUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly listModelsUseCase: IListModelsUseCase,
        private readonly streamCompletionUseCase: IStreamCompletionUseCase
    ) { }

    async execute (params: StreamPromptCompletionUseCaseParams): Promise<StreamPromptCompletionUseCaseResponse> {
        this.logger.info('Executing StreamPromptCompletionUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const listed = await this.listModelsUseCase.execute({ loadedOnly: true });
        const loaded = listed.models?.[0];
        if (!loaded) {
            return { success: false, error: 'No loaded model found on any connection' };
        }

        return this.streamCompletionUseCase.execute({
            connectionId: loaded.connection.id,
            samplerId: DEFAULT_SAMPLER.id,
            modelId: loaded.model.id,
            prompt: params.prompt,
        });
    }

    private validate (params: StreamPromptCompletionUseCaseParams): string | null {
        if (!params.prompt?.trim()) {
            return 'Prompt is required';
        }

        return null;
    }
}
