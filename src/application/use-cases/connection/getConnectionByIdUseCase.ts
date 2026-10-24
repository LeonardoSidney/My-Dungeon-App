import { ILogger } from '@domain/logger';
import { IConnectionRepository } from '@domain/repository';
import {
    GetConnectionByIdUseCaseParams,
    GetConnectionByIdUseCaseReturn,
    IGetConnectionByIdUseCase,
} from '@domain/use-cases';

export class GetConnectionByIdUseCase implements IGetConnectionByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly connectionRepository: IConnectionRepository
    ) { }

    async execute (params: GetConnectionByIdUseCaseParams): Promise<GetConnectionByIdUseCaseReturn> {
        this.logger.info('Executing GetConnectionByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const connectionResponse = await this.connectionRepository.getConnectionById(params.id);
        if (!connectionResponse.success) {
            this.logger.warning('GetConnectionByIdUseCase::execute - failed to load connection', connectionResponse.error);
            return { success: false, error: connectionResponse.error };
        }

        const connection = connectionResponse.connection;
        if (!connection) {
            return { success: false, error: `Connection with id ${params.id} not found` };
        }

        return { success: true, connection };
    }

    private validate (params: GetConnectionByIdUseCaseParams): string | null {
        if (!params.id?.trim()) {
            return 'Connection id is required';
        }

        return null;
    }
}
