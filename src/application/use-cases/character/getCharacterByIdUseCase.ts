import { ILogger } from '@domain/logger';
import { ICharacterRepository } from '@domain/repository';
import {
    GetCharacterByIdUseCaseParams,
    GetCharacterByIdUseCaseReturn,
    IGetCharacterByIdUseCase,
} from '@domain/use-cases';

export class GetCharacterByIdUseCase implements IGetCharacterByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly characterRepository: ICharacterRepository
    ) { }

    async execute (params: GetCharacterByIdUseCaseParams): Promise<GetCharacterByIdUseCaseReturn> {
        this.logger.info('Executing GetCharacterByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const characterResponse = await this.characterRepository.getCharacterById(params.id);
        if (!characterResponse.success) {
            this.logger.warning('GetCharacterByIdUseCase::execute - failed to load character', characterResponse.error);
            return { success: false, error: characterResponse.error };
        }

        const character = characterResponse.character;
        if (!character) {
            return { success: false, error: `Character with id ${params.id} not found` };
        }

        return { success: true, character };
    }

    private validate (params: GetCharacterByIdUseCaseParams): string | null {
        if (!params.id?.trim()) {
            return 'Character id is required';
        }

        return null;
    }
}
