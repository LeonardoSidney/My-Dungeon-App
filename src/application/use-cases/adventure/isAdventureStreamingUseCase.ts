import { ILogger } from '@domain/logger';
import { IIsAdventureStreamingService } from '@domain/services';
import {
    IsAdventureStreamingUseCaseParams,
    IsAdventureStreamingUseCaseReturn,
    IIsAdventureStreamingUseCase,
} from '@domain/use-cases';

export class IsAdventureStreamingUseCase implements IIsAdventureStreamingUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly isAdventureStreamingService: IIsAdventureStreamingService
    ) {}

    async execute (params: IsAdventureStreamingUseCaseParams): Promise<IsAdventureStreamingUseCaseReturn> {
        this.logger.info('Executing IsAdventureStreamingUseCase::execute');
        this.logger.debug('IsAdventureStreamingUseCase::execute - params', params);

        const response = this.isAdventureStreamingService.isAdventureStreaming({
            adventure: params.adventure,
        });

        return {
            success: response.success,
            isStreaming: response.isStreaming,
        };
    }
}
