import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import {
    GetChatByIdUseCaseParams,
    GetChatByIdUseCaseReturn,
    IGetChatByIdUseCase,
} from '@domain/use-cases';

export class GetChatByIdUseCase implements IGetChatByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: GetChatByIdUseCaseParams): Promise<GetChatByIdUseCaseReturn> {
        this.logger.info('Executing GetChatByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('GetChatByIdUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        const chat = adventure.chat.find(entry => entry.id === params.chatId);
        if (!chat) {
            return { success: false, error: `Chat with id ${params.chatId} not found` };
        }

        return { success: true, chat };
    }

    private validate (params: GetChatByIdUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        if (!params.chatId?.trim()) {
            return 'Chat id is required';
        }

        return null;
    }
}
