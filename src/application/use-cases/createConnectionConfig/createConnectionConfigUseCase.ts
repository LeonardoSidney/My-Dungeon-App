import { ILogger } from "../../../domain/logger";
import { ICreateConnectionConfigService } from "../../../domain/services/createConnectionConfig";
import { ICreateConnectionConfigRepository } from "../../../infrastructure/repository";
import { CreateConnectionConfigParams, CreateConnectionConfigReturn, ICreateConnectionConfigUseCase } from "./iCreateConnectionConfigUseCase";

export class CreateConnectionConfigUseCase implements ICreateConnectionConfigUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly service: ICreateConnectionConfigService,
        private readonly repository: ICreateConnectionConfigRepository
    ) { }
    public async execute(params: CreateConnectionConfigParams): Promise<CreateConnectionConfigReturn> {
        this.logger.info('Executing CreateConnectionConfigUseCase', params);
        this.validate(params);
        const { name, ip, port, auth } = params;
        const createParams = {
            name,
            ip,
            port,
            auth
        };
        this.logger.debug('Calling CreateConnectionConfigService', createParams);
        const response = this.service.createConnectionConfig(createParams);
        this.logger.debug('CreateConnectionConfigService executed successfully', response);
        if (!response.success) {
            const unknownErrorMessage = 'An unknown error occurred on CreateConnectionConfigService';
            throw new Error(response.error ?? unknownErrorMessage);
        }

        if (!response.connection) {
            throw new Error('Success is true but does not have an connection');
        }

        await this.repository.save({connection: response.connection});

        return { connection: response.connection };
    }

    private validate(params: CreateConnectionConfigParams): void {
        if (!params.name?.trim()) {
            throw new Error('A name is required to create a connection config');
        }

        if (!params.ip?.trim()) {
            throw new Error('An IP is required to create a connection config');
        }

        if (params.port && params.port <= 0) {
            throw new Error('A valid port is required to create a connection config');
        }
    }
}
