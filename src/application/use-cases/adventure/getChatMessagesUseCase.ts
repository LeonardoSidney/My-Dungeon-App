import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import {
    GetChatMessagesUseCaseParams,
    GetChatMessagesUseCaseReturn,
    IGetChatMessagesUseCase,
} from '@domain/use-cases';

export class GetChatMessagesUseCase implements IGetChatMessagesUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: GetChatMessagesUseCaseParams): Promise<GetChatMessagesUseCaseReturn> {
        this.logger.info('Executing GetChatMessagesUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('GetChatMessagesUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        return { success: true, chats: adventure.chat };
    }

    private validate (params: GetChatMessagesUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }
}
