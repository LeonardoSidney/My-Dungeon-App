import { Character } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IAdventureRepository, ICharacterRepository } from '@domain/repository';
import {
    GetAdventureCharactersUseCaseParams,
    GetAdventureCharactersUseCaseReturn,
    IGetAdventureCharactersUseCase,
} from '@domain/use-cases';

export class GetAdventureCharactersUseCase implements IGetAdventureCharactersUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly adventureRepository: IAdventureRepository,
        private readonly characterRepository: ICharacterRepository
    ) { }

    async execute (params: GetAdventureCharactersUseCaseParams): Promise<GetAdventureCharactersUseCaseReturn> {
        this.logger.info('Executing GetAdventureCharactersUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('GetAdventureCharactersUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        const responses = await Promise.all(adventure.characterIds.map(id => this.characterRepository.getCharacterById(id)));
        const failed = responses.find(response => !response.success);
        if (failed) {
            this.logger.warning('GetAdventureCharactersUseCase::execute - failed to load characters', failed.error);
            return { success: false, error: failed.error };
        }

        const found = responses
            .map(response => response.character)
            .filter((character): character is Character => character !== undefined);
        if (found.length !== adventure.characterIds.length) {
            this.logger.warning('GetAdventureCharactersUseCase::execute - some characters of the adventure were not found');
        }

        return { success: true, characters: found };
    }

    private validate (params: GetAdventureCharactersUseCaseParams): string | null {
        if (!params.adventureId?.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }
}
