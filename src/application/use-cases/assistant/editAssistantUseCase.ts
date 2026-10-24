import { ILogger } from '@domain/logger';
import {
    IAssistantRepository,
    IConnectionRepository,
    ISamplerRepository,
} from '@domain/repository';
import { AssistantEditParams, IEditAssistantService, IGetSamplersService } from '@domain/services';
import { EditAssistantParams, EditAssistantReturn, IEditAssistantUseCase } from '@domain/use-cases';
import { createSamplerResolver } from '@application/shared/resolveSampler';
import { REFERENCED_ENTITIES } from '@domain/constants/referencedEntities';
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
                error: validationError
            };
        }
        const missingIdError = await this.validateReferencedIds(params.editParams);
        if (missingIdError) {
            return {
                success: false,
                error: missingIdError
            };
        }

        const { id, editParams } = params;
        const assistantResponse = await this.assistantRepository.getAssistantById(id);
        if (!assistantResponse.success) {
            this.logger.warning('EditAssistantUseCase::execute - failed to load assistant', assistantResponse.error);
            return { success: false, error: assistantResponse.error };
        }

        const assistant = assistantResponse.assistant;
        if (!assistant) {
            return {
                success: false,
                error: `Assistant with id ${id} not found`
            };
        }

        this.logger.debug('Calling EditAssistantService', { id, editParams });
        const response = this.service.editAssistant({ assistant, editParams });
        this.logger.debug('EditAssistantService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred on EditAssistantService'
            };
        }

        if (!response.assistant) {
            return {
                success: false,
                error: 'Success is true but does not have an assistant'
            };
        }

        const editedAssistant = response.assistant;
        const existingAssistantsResponse = await this.assistantRepository.getAssistants();
        if (!existingAssistantsResponse.success || !existingAssistantsResponse.assistants) {
            this.logger.warning('EditAssistantUseCase::execute - failed to load assistants', existingAssistantsResponse.error);
            return { success: false, error: existingAssistantsResponse.error };
        }

        const existingAssistants = existingAssistantsResponse.assistants;
        const duplicateAssistant = existingAssistants.find(
            (a) => a.name === editedAssistant.name && a.id !== editedAssistant.id
        );

        if (duplicateAssistant) {
            this.logger.warning(`Assistant with name ${editedAssistant.name} already exists`);
            return {
                success: false,
                error: `Assistant with name ${editedAssistant.name} already exists`
            };
        }

        const editResult = await this.assistantRepository.editAssistant({ assistant: editedAssistant });
        if (!editResult.success) {
            return {
                success: false,
                error: editResult.error || 'Failed to edit assistant'
            };
        }

        return {
            id: editedAssistant.id,
            success: true
        };
    }

    private validate (params: EditAssistantParams): string | null {
        if (!params.id) {
            return 'An id is required to edit an assistant';
        }

        if (!params.editParams.name?.trim()) {
            return 'A name is required to edit an assistant';
        }

        return null;
    }

    private async validateReferencedIds (editParams: AssistantEditParams): Promise<string | null> {
        const resolveSampler = createSamplerResolver(this.samplerRepository, this.getSamplersService);
        const samplerError = await checkReferencedId(
            (id: string) => resolveSampler(id),
            REFERENCED_ENTITIES.SAMPLER,
            editParams.samplerId
        );
        if (samplerError) {
            return samplerError;
        }
        return checkReferencedId(
            (id: string) => this.connectionRepository.getConnectionById(id),
            REFERENCED_ENTITIES.CONNECTION,
            editParams.connectionId
        );
    }
}
