import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IDeleteThinkVersionService } from '@domain/services';
import {
    IDeleteThinkVersionUseCase,
    DeleteThinkVersionUseCaseParams,
    DeleteThinkVersionUseCaseReturn,
} from '@domain/use-cases';

export class DeleteThinkVersionUseCase implements IDeleteThinkVersionUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly deleteThinkVersionService: IDeleteThinkVersionService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: DeleteThinkVersionUseCaseParams): Promise<DeleteThinkVersionUseCaseReturn> {
        this.logger.info('Executing DeleteThinkVersionUseCase::execute');
        this.logger.debug('Executing DeleteThinkVersionUseCase::execute - params', {
            adventureId: params.adventureId,
            chatId: params.chatId,
            versionIndex: params.versionIndex,
        });

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('DeleteThinkVersionUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        const targetThinkLength = adventure.chat.find(c => c.id === params.chatId)?.think?.length ?? 0;

        if (targetThinkLength === 1) {
            this.logger.warning('DeleteThinkVersionUseCase::execute - refusing to delete the only think version', { chatId: params.chatId });
            return { success: false, error: 'The only think version of a chat cannot be deleted' };
        }

        const response = this.deleteThinkVersionService.deleteThink({ chatId: params.chatId, versionIndex: params.versionIndex, adventure });

        if (!response.success) {
            this.logger.warning('DeleteThinkVersionUseCase::execute - service failed', response.error);
            return { success: false, error: response.error };
        }

        if (!response.adventure) {
            return { success: false, error: 'Service returned success but no adventure object' };
        }

        const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
        if (!update.success) {
            this.logger.error('DeleteThinkVersionUseCase::execute - failed to save adventure', update.error);
            return { success: false, error: update.error || 'Failed to save adventure' };
        }

        this.logger.debug('DeleteThinkVersionUseCase::execute - adventure persisted');

        return { success: true };
    }

    private validate (params: DeleteThinkVersionUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        if (!params.chatId?.trim()) {
            return 'Chat id is required';
        }

        return null;
    }
}
