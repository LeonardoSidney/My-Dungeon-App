import { ILogger } from '@domain/logger';
import { IAssistantRepository } from '@domain/repository';
import { ICreateAssistantService } from '@domain/services';
import { CreateAssistantUseCaseParams, CreateAssistantUseCaseResponse, ICreateAssistantUseCase } from '@domain/use-cases';

export class CreateAssistantUseCase implements ICreateAssistantUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly assistantRepository: IAssistantRepository,
        private readonly service: ICreateAssistantService
    ) { }

    async execute (params: CreateAssistantUseCaseParams): Promise<CreateAssistantUseCaseResponse> {
        this.logger.info('Executing CreateAssistantUseCase::execute');
        this.logger.debug('Execute CreateAssistantUseCase::execute - params: ', params);

        const { name, observation, model, sampler } = params;
        const response = await this.service.createAssistant({
            name,
            observation,
            model,
            sampler
        });
        this.logger.debug('Execute CreateAssistantUseCase::execute - service response: ', response);

        if (!response.success) {
            return {
                success: false,
                error: response.error
            };
        }

        if (!response.assistant) {
            throw new Error('Unexpected error: assistant is null');
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
}
