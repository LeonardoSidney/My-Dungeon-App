import { ILogger } from "../../../domain/logger";
import { IStatusRepository } from "../../../domain/repository/IStatusRepository";
import { ICreateStatusService } from "../../../domain/services";
import { CreateStatusUseCaseParams, CreateStatusUseCaseResponse, ICreateStatusUseCase } from "../../../domain/use-cases";

export class CreateStatusUseCase implements ICreateStatusUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly service: ICreateStatusService,
        private readonly statusRepository: IStatusRepository
    ) { }
    async execute(params: CreateStatusUseCaseParams): Promise<CreateStatusUseCaseResponse> {
        this.logger.info("Executing CreateStatusUseCase::execute");
        this.logger.debug("Executing CreateStatusUseCase::execute - params", params);

        this.validate(params);

        this.logger.debug("Calling CreateStatusService", params);
        const response = this.service.createStatus(params);
        this.logger.debug('CreateStatusService executed successfully', response);

        if (!response.success) {
            return {
                success: response.success,
                error: response.error
            };
        }

        if (!response.status) {
            throw new Error("Unexpected error while creating status");
        }

        const statuses = await this.statusRepository.getStatuses();
        this.logger.debug('StatusRepository executed successfully', statuses);
        const alreadyExists = statuses.find(status => status.name === response.status?.name);

        if (alreadyExists) {
            this.logger.warning(`Status with name ${response.status.name} already exists`);
            return {
                success: false,
                error: "Status already exists"
            };
        }

        await this.statusRepository.saveStatus({ status: response.status });

        return {
            success: true,
            status: response.status
        };
    }

    private validate(params: CreateStatusUseCaseParams) {
        if (!params.name?.trim()) {
            throw new Error("name is required to create a status");
        }

        if (!params.activationWord?.trim()) {
            throw new Error("activationWord is required to create a status");
        }

        if (!params.prompt?.trim()) {
            throw new Error("prompt is required to create a status");
        }
    }
}
