import { ILogger } from '@domain/logger';
import {
    IAssistantRepository,
    IConnectionRepository,
    ISamplerRepository,
} from '@domain/repository';
import { ICreateAssistantService, IGetSamplersService } from '@domain/services';
import { CreateAssistantUseCaseParams, CreateAssistantUseCaseResponse, ICreateAssistantUseCase } from '@domain/use-cases';
import { createSamplerResolver } from '@application/shared/resolveSampler';
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

        const assistants = await this.assistantRepository.getAssistants();
        this.logger.debug('Execute CreateAssistantUseCase::execute - assistants: ', assistants);
        const alreadyExists = assistants.some((assistant) => assistant.name === name);

        if (alreadyExists) {
            this.logger.warning(`Assistant with name ${response.assistant.name} already exists`);
            return {
                success: false,
                error: `Assistant with this name ${response.assistant.name} already exists`
            };
        }

        await this.assistantRepository.saveAssistant({ assistant: response.assistant });

        return {
            success: true,
            assistant: response.assistant
        };
    }

    private async validateReferencedIds (params: CreateAssistantUseCaseParams): Promise<string | null> {
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
