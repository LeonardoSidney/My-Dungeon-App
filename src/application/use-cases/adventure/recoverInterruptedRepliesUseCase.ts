import { ILogger } from '@domain/logger';
import { IStreamSessionRegistry } from '@domain/providers';
import { IAdventureRepository } from '@domain/repository';
import { IRecoverInterruptedChatsService } from '@domain/services';
import { IRecoverInterruptedRepliesUseCase, RecoverInterruptedRepliesUseCaseReturn } from '@domain/use-cases';

export class RecoverInterruptedRepliesUseCase implements IRecoverInterruptedRepliesUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository,
        private readonly recoverInterruptedChatsService: IRecoverInterruptedChatsService,
        private readonly registry: IStreamSessionRegistry
    ) { }

    async execute (): Promise<RecoverInterruptedRepliesUseCaseReturn> {
        this.logger.info('Executing RecoverInterruptedRepliesUseCase::execute');

        const response = await this.adventureRepository.getAdventures();
        if (!response.success || !response.adventures) {
            this.logger.warning('RecoverInterruptedRepliesUseCase::execute - failed to load adventures', response.error);
            return { success: false, error: response.error };
        }

        const recoveredChatIds: string[] = [];
        const errors: string[] = [];

        for (const adventure of response.adventures) {
            if (this.registry.isActive(adventure.id) || !adventure.chat.some(chat => chat.isStreaming)) {
                continue;
            }

            const recovered = this.recoverInterruptedChatsService.recover({ adventure });
            if (!recovered.success || !recovered.adventure) {
                errors.push(recovered.error ?? `Failed to recover adventure ${adventure.id}`);
                continue;
            }

            const update = await this.adventureRepository.updateAdventure({ adventure: recovered.adventure });
            if (!update.success) {
                this.logger.error('RecoverInterruptedRepliesUseCase::execute - failed to save adventure', update.error);
                errors.push(update.error ?? `Failed to save adventure ${adventure.id}`);
                continue;
            }

            recoveredChatIds.push(...(recovered.recoveredChatIds ?? []));
        }

        if (recoveredChatIds.length > 0) {
            this.logger.info('RecoverInterruptedRepliesUseCase::execute - recovered interrupted chats', recoveredChatIds);
        }

        if (errors.length > 0) {
            return { success: false, recoveredChatIds, error: errors.join('\n') };
        }

        return { success: true, recoveredChatIds };
    }
}
