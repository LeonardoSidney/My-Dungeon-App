import {
    EditConnectionControllerRequest,
    EditConnectionControllerResponse,
    IEditConnectionController
} from '@domain/controllers';
import { ILogger } from '@domain/logger';
import { IEditConnectionUseCase } from '@domain/use-cases';

export class EditConnectionController implements IEditConnectionController {
    constructor(
        private readonly logger: ILogger,
        private readonly useCase: IEditConnectionUseCase
    ) { }

    async handle(request: EditConnectionControllerRequest): Promise<EditConnectionControllerResponse> {
        this.logger.info('Executing EditConnectionController::handle');
        const { id, name, ip, port, auth, createdAt } = request;
        const response = await this.useCase.execute({
            id,
            name,
            ip,
            port,
            auth,
            createdAt
        });

        return {
            success: response.success,
            connection: response.connection,
            error: response.error
        };
    }
}
