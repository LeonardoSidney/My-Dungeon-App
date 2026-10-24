import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IAddThinkVersionService } from '@domain/services';
import {
    IAddThinkVersionUseCase,
    AddThinkVersionUseCaseParams,
    AddThinkVersionUseCaseReturn,
} from '@domain/use-cases';

export class AddThinkVersionUseCase implements IAddThinkVersionUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly addThinkVersionService: IAddThinkVersionService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: AddThinkVersionUseCaseParams): Promise<AddThinkVersionUseCaseReturn> {
        this.logger.info('Executing AddThinkVersionUseCase::execute');
        this.logger.debug('Executing AddThinkVersionUseCase::execute - params', {
            adventureId: params.adventureId,
            chatId: params.chatId,
        });

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('AddThinkVersionUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        const response = this.addThinkVersionService.addVersion({ ...params, adventure });

        if (!response.success) {
            this.logger.warning('AddThinkVersionUseCase::execute - service failed', response.error);
            return { success: false, error: response.error };
        }

        if (!response.adventure) {
            return { success: false, error: 'Service returned success but no adventure object' };
        }

        const update = await this.adventureRepository.updateAdventure({ adventure: response.adventure });
        if (!update.success) {
            this.logger.error('AddThinkVersionUseCase::execute - failed to save adventure', update.error);
            return { success: false, error: update.error || 'Failed to save adventure' };
        }

        this.logger.debug('AddThinkVersionUseCase::execute - adventure persisted');

        return { success: true };
    }

    private validate (params: AddThinkVersionUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        if (!params.chatId?.trim()) {
            return 'Chat id is required';
        }

        if (!params.content?.trim()) {
            return 'Content is required to add a think version';
        }

        return null;
    }
}
