import { ILogger } from '@domain/logger';
import { IWorldRepository } from '@domain/repository';
import {
    GetWorldByIdUseCaseParams,
    GetWorldByIdUseCaseReturn,
    IGetWorldByIdUseCase,
} from '@domain/use-cases';

export class GetWorldByIdUseCase implements IGetWorldByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly worldRepository: IWorldRepository
    ) { }

    async execute (params: GetWorldByIdUseCaseParams): Promise<GetWorldByIdUseCaseReturn> {
        this.logger.info('Executing GetWorldByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const worldResponse = await this.worldRepository.getWorldById(params.id);
        if (!worldResponse.success) {
            this.logger.warning('GetWorldByIdUseCase::execute - failed to load world', worldResponse.error);
            return { success: false, error: worldResponse.error };
        }

        const world = worldResponse.world;
        if (!world) {
            return { success: false, error: `World with id ${params.id} not found` };
        }

        return { success: true, world };
    }

    private validate (params: GetWorldByIdUseCaseParams): string | null {
        if (!params.id?.trim()) {
            return 'World id is required';
        }

        return null;
    }
}
