import { ILogger } from '@domain/logger';
import {
    IAssistantRepository,
    IConnectionRepository,
    ISamplerRepository,
} from '@domain/repository';
import { IEditAssistantService, IGetSamplersService } from '@domain/services';
import { EditAssistantParams, EditAssistantReturn, IEditAssistantUseCase } from '@domain/use-cases';
import { createSamplerResolver } from '@application/shared/resolveSampler';
import { checkReferencedId } from '@application/shared/validateReferencedIds';

export class EditAssistantUseCase implements IEditAssistantUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditAssistantService,
        private readonly assistantRepository: IAssistantRepository,
        private readonly samplerRepository: ISamplerRepository,
        private readonly getSamplersService: IGetSamplersService,
        private readonly connectionRepository: IConnectionRepository
    ) { }

    async execute (params: EditAssistantParams): Promise<EditAssistantReturn> {
        this.logger.info('Executing EditAssistantUseCase::execute');
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                assistant: undefined,
                error: validationError
            };
        }
        const missingIdError = await this.validateReferencedIds(params);
        if (missingIdError) {
            return {
                success: false,
                assistant: undefined,
                error: missingIdError
            };
        }

        const { id, name, observation, modelId, samplerId, connectionId, createdAt } = params;

        this.logger.debug('Calling EditAssistantService', { id, name, observation, modelId, samplerId, connectionId, createdAt });
        const response = this.service.editAssistant({ id, name, observation, modelId, samplerId, connectionId, createdAt });
        this.logger.debug('EditAssistantService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                assistant: undefined,
                error: response.error || 'An unknown error occurred on EditAssistantService'
            };
        }

        if (!response.assistant) {
            return {
                success: false,
                assistant: undefined,
                error: 'Success is true but does not have an assistant'
            };
        }

        const editedAssistant = response.assistant;
        const existingAssistants = await this.assistantRepository.getAssistants();
        const duplicateAssistant = existingAssistants.find(
            (a) => a.name === editedAssistant.name && a.id !== editedAssistant.id
        );

        if (duplicateAssistant) {
            this.logger.warning(`Assistant with name ${editedAssistant.name} already exists`);
            return {
                success: false,
                assistant: undefined,
                error: `Assistant with name ${editedAssistant.name} already exists`
            };
        }

        const editResult = await this.assistantRepository.editAssistant({ assistant: editedAssistant });
        if (!editResult.success) {
            return {
                success: false,
                assistant: undefined,
                error: editResult.error || 'Failed to edit assistant'
            };
        }

        return {
            assistant: editedAssistant,
            success: true
        };
    }

    private validate (params: EditAssistantParams): string | null {
        if (!params.id) {
            return 'An id is required to edit an assistant';
        }

        if (!params.name?.trim()) {
            return 'A name is required to edit an assistant';
        }

        return null;
    }

    private async validateReferencedIds (params: EditAssistantParams): Promise<string | null> {
        const resolveSampler = createSamplerResolver(this.samplerRepository, this.getSamplersService);
        const samplerError = await checkReferencedId(
            (id) => resolveSampler(id),
            params.samplerId,
            'Sampler'
        );
        if (samplerError) {
            return samplerError;
        }
        return checkReferencedId(
            (id) => this.connectionRepository.getConnectionById(id),
            params.connectionId,
            'Connection'
        );
    }
}
