import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IAppendChatAdventureService } from '@domain/services';
import { AppendChatUseCaseParams, AppendChatUseCaseReturn, IAppendChatAdventureUseCase } from '@domain/use-cases';

export class AppendChatAdventureUseCase implements IAppendChatAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository,
        private readonly service: IAppendChatAdventureService
    ) {}

    async execute (params: AppendChatUseCaseParams): Promise<AppendChatUseCaseReturn> {
        this.logger.info('Executing AppendChatAdventureUseCase::execute');
        this.logger.debug('Executing AppendChatAdventureUseCase::execute - params', params);

        const { adventure, message } = params;

        const response = this.service.appendChat({ adventure, chat: message });
        if (!response.success) {
            this.logger.warning('AppendChatAdventureUseCase::execute - service failed', response.error);
            return {
                success: false,
                error: response.error,
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
            adventure: response.adventure,
        };
    }
}
