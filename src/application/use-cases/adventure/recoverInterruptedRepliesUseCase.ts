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

        const response = await this.adventureRepository.getAdventureIndex();
        if (!response.success || !response.entries) {
            this.logger.warning('RecoverInterruptedRepliesUseCase::execute - failed to load adventures', response.error);
            return { success: false, error: response.error };
        }

        const recoveredChatIds: string[] = [];
        const errors: string[] = [];

        const interruptedEntries = response.entries.filter(entry => entry.hasStreamingChat && !this.registry.isActive(entry.id));

        for (const entry of interruptedEntries) {
            const adventureResponse = await this.adventureRepository.getAdventureById(entry.id);
            if (!adventureResponse.success || !adventureResponse.adventure) {
                errors.push(adventureResponse.error ?? `Adventure with id ${entry.id} not found`);
                continue;
            }

            const adventure = adventureResponse.adventure;
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
