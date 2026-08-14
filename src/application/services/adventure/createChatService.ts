import { Chat } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import {
    CreateChatServiceParams,
    CreateChatServiceReturn,
    ICreateChatService,
} from '@domain/services';

export class CreateChatService implements ICreateChatService {
    constructor (
        private readonly logger: ILogger,
        private readonly idGenerator: IIdGenerator
    ) {}

    createChat (params: CreateChatServiceParams): CreateChatServiceReturn {
        this.logger.info('Executing CreateChatService::createChat');
        this.logger.debug('CreateChatService::createChat - params', params);

        const now = new Date();
        const role = params.role;

        const chat: Chat = {
            id: this.idGenerator.generate(),
            role,
            index: 0,
            content: [params.content],
            think: params.think ? [params.think] : undefined,
            characterName: params.characterName,
            createdAt: now,
            updatedAt: now,
        };

        this.logger.debug('CreateChatService::createChat - chat created', chat);

        return {
            success: true,
            chat,
        };
    }
}
