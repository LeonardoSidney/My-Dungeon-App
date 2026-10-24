import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import {
    GetAdventureByIdUseCaseParams,
    GetAdventureByIdUseCaseResponse,
    IGetAdventureByIdUseCase,
} from '@domain/use-cases';

export class GetAdventureByIdUseCase implements IGetAdventureByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: GetAdventureByIdUseCaseParams): Promise<GetAdventureByIdUseCaseResponse> {
        this.logger.info('Executing GetAdventureByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.id);
        if (!adventureResponse.success) {
            this.logger.warning('GetAdventureByIdUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return {
                success: false,
                error: `Adventure with id ${params.id} not found`,
            };
        }

        return {
            success: true,
            adventure,
        };
    }

    private validate (params: GetAdventureByIdUseCaseParams): string | null {
        if (!params.id.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }
}
