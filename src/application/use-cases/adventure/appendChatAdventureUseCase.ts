import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { RoleEnum } from '@domain/entities';
import { IAppendChatAdventureService, ICreateChatService } from '@domain/services';
import { AppendChatUseCaseParams, AppendChatUseCaseReturn, IAppendChatAdventureUseCase } from '@domain/use-cases';

export class AppendChatAdventureUseCase implements IAppendChatAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository,
        private readonly service: IAppendChatAdventureService,
        private readonly createChatService: ICreateChatService
    ) { }

    async execute (params: AppendChatUseCaseParams): Promise<AppendChatUseCaseReturn> {
        this.logger.info('Executing AppendChatAdventureUseCase::execute');
        this.logger.debug('Executing AppendChatAdventureUseCase::execute - params', params);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('AppendChatAdventureUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return {
                success: false,
                error: `Adventure with id ${params.adventureId} not found`,
            };
        }

        const created = this.createChatService.createChat({
            content: params.content,
            role: RoleEnum.USER,
            characterId: params.characterId,
        });
        if (!created.success || !created.chat) {
            return { success: false, error: created.error ?? 'Failed to create chat message' };
        }

        const response = this.service.appendChat({ adventure, chat: created.chat });
        if (!response.success) {
            this.logger.warning('AppendChatAdventureUseCase::execute - service failed', response.error);
            return {
                success: false,
                error: response.error,
            };
        }

        if (!response.adventure) {
            return {
                success: false,
                error: 'Service returned success but no adventure object',
            };
        }

        const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
        if (!update.success) {
            this.logger.error('AppendChatAdventureUseCase::execute - failed to save adventure', update.error);
            return {
                success: false,
                error: update.error || 'Failed to save adventure',
            };
        }

        return {
            success: true,
            id: created.chat.id,
        };
    }

    private validate (params: AppendChatUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        if (!params.content?.trim()) {
            return 'Content is required to send a message';
        }

        if (!params.characterId?.trim()) {
            return 'Character id is required to send a message';
        }

        return null;
    }
}
