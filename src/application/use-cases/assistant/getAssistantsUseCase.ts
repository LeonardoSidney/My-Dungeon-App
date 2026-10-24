import { ILogger } from '@domain/logger';
import { IAssistantRepository } from '@domain/repository';
import { GetAssistantsUseCaseReturn, IGetAssistantsUseCase } from '@domain/use-cases';

export class GetAssistantsUseCase implements IGetAssistantsUseCase {
    constructor (
        private logger: ILogger,
        private assistantRepository: IAssistantRepository
    ) { }

    async execute (): Promise<GetAssistantsUseCaseReturn> {
        this.logger.info('Executing GetAssistantsUseCase::execute');

        const assistantsResponse = await this.assistantRepository.getAssistants();
        if (!assistantsResponse.success || !assistantsResponse.assistants) {
            this.logger.warning('GetAssistantsUseCase::execute - failed to load assistants', assistantsResponse.error);
            return { success: false, error: assistantsResponse.error };
        }

        const assistants = assistantsResponse.assistants;
        this.logger.debug('Repository getAssistants executed successfully: ', assistants);

        return { success: true, assistants };
    }
}
