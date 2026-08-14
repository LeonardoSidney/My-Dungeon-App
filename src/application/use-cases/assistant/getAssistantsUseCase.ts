import { Assistant } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IAssistantRepository } from '@domain/repository';
import { IGetAssistantsUseCase } from '@domain/use-cases';

export class GetAssistantsUseCase implements IGetAssistantsUseCase {
    constructor (
        private logger: ILogger,
        private assistantRepository: IAssistantRepository
    ) { }

    async execute (): Promise<Assistant[]> {
        this.logger.info('Executing GetAssistantsUseCase::execute');
        const assistants = await this.assistantRepository.getAssistants();
        this.logger.debug('Repository getAssistants executed successfully: ', assistants);
        return assistants;
    }
}
