import { ILogger } from '@domain/logger';
import { IAssistantRepository } from '@domain/repository';
import {
    GetAssistantByIdUseCaseParams,
    GetAssistantByIdUseCaseReturn,
    IGetAssistantByIdUseCase,
} from '@domain/use-cases';

export class GetAssistantByIdUseCase implements IGetAssistantByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly assistantRepository: IAssistantRepository
    ) { }

    async execute (params: GetAssistantByIdUseCaseParams): Promise<GetAssistantByIdUseCaseReturn> {
        this.logger.info('Executing GetAssistantByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const assistantResponse = await this.assistantRepository.getAssistantById(params.id);
        if (!assistantResponse.success) {
            this.logger.warning('GetAssistantByIdUseCase::execute - failed to load assistant', assistantResponse.error);
            return { success: false, error: assistantResponse.error };
        }

        const assistant = assistantResponse.assistant;
        if (!assistant) {
            return { success: false, error: `Assistant with id ${params.id} not found` };
        }

        return { success: true, assistant };
    }

    private validate (params: GetAssistantByIdUseCaseParams): string | null {
        if (!params.id?.trim()) {
            return 'Assistant id is required';
        }

        return null;
    }
}
