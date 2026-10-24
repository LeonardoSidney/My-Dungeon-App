import { ILogger } from '@domain/logger';
import { IStatusRepository } from '@domain/repository';
import {
    GetStatusByIdUseCaseParams,
    GetStatusByIdUseCaseReturn,
    IGetStatusByIdUseCase,
} from '@domain/use-cases';

export class GetStatusByIdUseCase implements IGetStatusByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly statusRepository: IStatusRepository
    ) { }

    async execute (params: GetStatusByIdUseCaseParams): Promise<GetStatusByIdUseCaseReturn> {
        this.logger.info('Executing GetStatusByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const statusResponse = await this.statusRepository.getStatusById(params.id);
        if (!statusResponse.success) {
            this.logger.warning('GetStatusByIdUseCase::execute - failed to load status', statusResponse.error);
            return { success: false, error: statusResponse.error };
        }

        const status = statusResponse.status;
        if (!status) {
            return { success: false, error: `Status with id ${params.id} not found` };
        }

        return { success: true, status };
    }

    private validate (params: GetStatusByIdUseCaseParams): string | null {
        if (!params.id?.trim()) {
            return 'Status id is required';
        }

        return null;
    }
}
