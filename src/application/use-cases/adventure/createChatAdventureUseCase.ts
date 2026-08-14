import { RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    CreateChatAdventureUseCaseParams,
    CreateChatAdventureUseCaseReturn,
    ICreateChatAdventureUseCase,
} from '@domain/use-cases';
import { ICreateChatService } from '@domain/services';

export class CreateChatAdventureUseCase implements ICreateChatAdventureUseCase {
    constructor (private readonly logger: ILogger, private readonly createChatService: ICreateChatService) {}

    async execute (params: CreateChatAdventureUseCaseParams): Promise<CreateChatAdventureUseCaseReturn> {
        this.logger.info('Executing CreateChatAdventureUseCase::execute');
        this.logger.debug('Executing CreateChatAdventureUseCase::execute - params', params);

        const validation = this.validate(params);
        if (!validation.success) {
            return validation;
        }

        const response = this.createChatService.createChat({
            content: params.content,
            role: params.role,
            think: params.think,
            characterName: params.characterName,
        });

        this.logger.debug('CreateChatAdventureUseCase::execute - chat created', response.chat);

        return {
            success: response.success,
            chat: response.chat,
            error: response.error,
        };
    }

    private validate (params: CreateChatAdventureUseCaseParams): CreateChatAdventureUseCaseReturn {
        if (!params.content?.trim()) {
            this.logger.warning('CreateChatAdventureUseCase::validate - content is required');
            return {
                success: false,
                error: 'Content is required to create a chat',
            };
        }

        if (!this.isValidRole(params.role)) {
            this.logger.warning(`CreateChatAdventureUseCase::validate - invalid role: ${params.role}`);
            return {
                success: false,
                error: 'Invalid role provided',
            };
        }

        if (params.think !== undefined && typeof params.think !== 'object') {
            this.logger.warning('CreateChatAdventureUseCase::validate - think must be an object');
            return {
                success: false,
                error: 'Think must be an object',
            };
        }

        return { success: true };
    }

    private isValidRole (role: string): boolean {
        return Object.values(RoleEnum).includes(role as RoleEnum);
    }
}
