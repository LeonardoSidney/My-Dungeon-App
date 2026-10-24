import { ILogger } from '@domain/logger';
import { IDraftChannel, IStreamSessionRegistry } from '@domain/providers';
import {
    ISubscribeDraftUseCase,
    SubscribeDraftUseCaseParams,
    SubscribeDraftUseCaseReturn,
} from '@domain/use-cases';

export class SubscribeDraftUseCase implements ISubscribeDraftUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly channel: IDraftChannel,
        private readonly registry: IStreamSessionRegistry
    ) { }

    execute (params: SubscribeDraftUseCaseParams): SubscribeDraftUseCaseReturn {
        this.logger.info('Executing SubscribeDraftUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const unsubscribe = this.channel.subscribe(params.draftId, params.listener);

        return {
            success: true,
            isStreaming: this.registry.isActive(params.draftId),
            unsubscribe,
        };
    }

    private validate (params: SubscribeDraftUseCaseParams): string | null {
        if (!params.draftId?.trim()) {
            return 'Draft id is required';
        }

        return null;
    }
}
