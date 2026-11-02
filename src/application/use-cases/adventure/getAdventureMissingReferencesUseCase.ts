import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IFindAdventureMissingReferencesService } from '@domain/services';
import {
    GetAdventureMissingReferencesUseCaseParams,
    GetAdventureMissingReferencesUseCaseReturn,
    IGetAdventureMissingReferencesUseCase,
} from '@domain/use-cases';

export class GetAdventureMissingReferencesUseCase implements IGetAdventureMissingReferencesUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository,
        private readonly service: IFindAdventureMissingReferencesService
    ) { }

    async execute (params: GetAdventureMissingReferencesUseCaseParams): Promise<GetAdventureMissingReferencesUseCaseReturn> {
        this.logger.info('Executing GetAdventureMissingReferencesUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('GetAdventureMissingReferencesUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        const response = await this.service.find({ adventure });
        if (!response.success) {
            return { success: false, error: response.error ?? 'Failed to check the adventure references' };
        }

        return { success: true, missingReferences: response.missingReferences };
    }

    private validate (params: GetAdventureMissingReferencesUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }
}
