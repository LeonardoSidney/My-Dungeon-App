import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IAdventureAppendChatService } from '@domain/services';
import { AppendChatUseCaseParams, AppendChatUseCaseReturn, IAdventureAppendChatUseCase } from '@domain/use-cases';

export class AdventureAppendChatUseCase implements IAdventureAppendChatUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository,
        private readonly service: IAdventureAppendChatService
    ) { }

    async execute(params: AppendChatUseCaseParams): Promise<AppendChatUseCaseReturn> {
        this.logger.info('Executing AdventureAppendChatUseCase::execute');
        this.logger.debug('Executing AdventureAppendChatUseCase::execute - params', params);

        const { adventure, message } = params;

        const response = this.service.appendChat({ adventure, chat: message });
        if (!response.success) {
            this.logger.warning('AdventureAppendChatUseCase::execute - service failed', response.error);
            return {
                success: false,
                error: response.error
            };
        }

        if (!response.adventure) {
            throw new Error('Service returned success but no adventure object');
        }

        const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
        if (!update) {
            throw new Error('Failed to save adventure');
        }

        return {
            success: true,
            adventure: response.adventure
        };
    }
}
