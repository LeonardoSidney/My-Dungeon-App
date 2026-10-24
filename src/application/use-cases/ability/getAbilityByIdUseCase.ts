import { ILogger } from '@domain/logger';
import { IAbilityRepository } from '@domain/repository';
import {
    GetAbilityByIdUseCaseParams,
    GetAbilityByIdUseCaseReturn,
    IGetAbilityByIdUseCase,
} from '@domain/use-cases';

export class GetAbilityByIdUseCase implements IGetAbilityByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly abilityRepository: IAbilityRepository
    ) { }

    async execute (params: GetAbilityByIdUseCaseParams): Promise<GetAbilityByIdUseCaseReturn> {
        this.logger.info('Executing GetAbilityByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const abilityResponse = await this.abilityRepository.getAbilityById(params.id);
        if (!abilityResponse.success) {
            this.logger.warning('GetAbilityByIdUseCase::execute - failed to load ability', abilityResponse.error);
            return { success: false, error: abilityResponse.error };
        }

        const ability = abilityResponse.ability;
        if (!ability) {
            return { success: false, error: `Ability with id ${params.id} not found` };
        }

        return { success: true, ability };
    }

    private validate (params: GetAbilityByIdUseCaseParams): string | null {
        if (!params.id?.trim()) {
            return 'Ability id is required';
        }

        return null;
    }
}
