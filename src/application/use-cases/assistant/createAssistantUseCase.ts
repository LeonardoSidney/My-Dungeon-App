import { ILogger } from '@domain/logger';
import {
    IAssistantRepository,
    IConnectionRepository,
    ISamplerRepository,
} from '@domain/repository';
import { ICreateAssistantService, IGetSamplersService } from '@domain/services';
import { CreateAssistantUseCaseParams, CreateAssistantUseCaseResponse, ICreateAssistantUseCase } from '@domain/use-cases';
import { createSamplerResolver } from '@application/shared/resolveSampler';
import { REFERENCED_ENTITIES } from '@domain/constants/referencedEntities';
import { checkReferencedId } from '@application/shared/validateReferencedIds';

export class CreateAssistantUseCase implements ICreateAssistantUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly assistantRepository: IAssistantRepository,
        private readonly service: ICreateAssistantService,
        private readonly samplerRepository: ISamplerRepository,
        private readonly getSamplersService: IGetSamplersService,
        private readonly connectionRepository: IConnectionRepository
    ) { }

    async execute (params: CreateAssistantUseCaseParams): Promise<CreateAssistantUseCaseResponse> {
        this.logger.info('Executing CreateAssistantUseCase::execute');
        this.logger.debug('Execute CreateAssistantUseCase::execute - params: ', params);

        const missingIdError = await this.validateReferencedIds(params);
        if (missingIdError) {
            return {
                success: false,
                error: missingIdError
            };
        }

        const { name, observation, modelId, samplerId, connectionId } = params;
        const response = await this.service.createAssistant({
            name,
            observation,
            modelId,
            samplerId,
            connectionId
        });
        this.logger.debug('Execute CreateAssistantUseCase::execute - service response: ', response);

        if (!response.success) {
            return {
                success: false,
                error: response.error
            };
        }

        if (!response.assistant) {
            return {
                success: false,
                error: 'Unexpected error: assistant is null'
            };
        }

        const assistantsResponse = await this.assistantRepository.getAssistants();
        if (!assistantsResponse.success || !assistantsResponse.assistants) {
            this.logger.warning('CreateAssistantUseCase::execute - failed to load assistants', assistantsResponse.error);
            return { success: false, error: assistantsResponse.error };
        }

        const assistants = assistantsResponse.assistants;
        this.logger.debug('Execute CreateAssistantUseCase::execute - assistants: ', assistants);
        const alreadyExists = assistants.some((assistant) => assistant.name === name);

        if (alreadyExists) {
            this.logger.warning(`Assistant with name ${response.assistant.name} already exists`);
            return {
                success: false,
                error: `Assistant with this name ${response.assistant.name} already exists`
            };
        }

        const saveResult = await this.assistantRepository.saveAssistant({ assistant: response.assistant });
        if (!saveResult.success) {
            this.logger.warning('CreateAssistantUseCase::execute - failed to save assistant', saveResult.error);
            return { success: false, error: saveResult.error };
        }

        return {
            success: true,
            id: response.assistant.id
        };
    }

    private async validateReferencedIds (params: CreateAssistantUseCaseParams): Promise<string | null> {
        const resolveSampler = createSamplerResolver(this.samplerRepository, this.getSamplersService);
        const samplerError = await checkReferencedId(
            (id: string) => resolveSampler(id),
            REFERENCED_ENTITIES.SAMPLER,
            params.samplerId
        );
        if (samplerError) {
            return samplerError;
        }
        return checkReferencedId(
            (id: string) => this.connectionRepository.getConnectionById(id),
            REFERENCED_ENTITIES.CONNECTION,
            params.connectionId
        );
    }
}
