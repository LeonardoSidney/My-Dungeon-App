import { ILogger } from '@domain/logger';
import { ISystemPromptRepository } from '@domain/repository';
import { IEditSystemPromptService } from '@domain/services';
import { EditSystemPromptParams, EditSystemPromptReturn, IEditSystemPromptUseCase } from '@domain/use-cases';

export class EditSystemPromptUseCase implements IEditSystemPromptUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditSystemPromptService,
        private readonly systemPromptRepository: ISystemPromptRepository
    ) { }

    async execute (params: EditSystemPromptParams): Promise<EditSystemPromptReturn> {
        this.logger.info('Executing EditSystemPromptUseCase::execute');
        this.validate(params);

        const { systemPrompt } = params;

        this.logger.debug('Calling EditSystemPromptService', systemPrompt);
        const response = this.service.editSystemPrompt({ systemPrompt });
        this.logger.debug('EditSystemPromptService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                systemPrompt: undefined,
                error: response.error || 'An unknown error occurred on EditSystemPromptService'
            };
        }

        if (!response.systemPrompt) {
            return {
                success: false,
                systemPrompt: undefined,
                error: 'Success is true but does not have a systemPrompt'
            };
        }

        const editedSystemPrompt = response.systemPrompt;
        const existingSystemPrompts = await this.systemPromptRepository.getSystemPrompts();
        const duplicateSystemPrompt = existingSystemPrompts.find(
            (sp) => sp.name === editedSystemPrompt.name && sp.id !== editedSystemPrompt.id
        );

        if (duplicateSystemPrompt) {
            this.logger.warning(`System prompt with name ${editedSystemPrompt.name} already exists`);
            return {
                success: false,
                systemPrompt: undefined,
                error: `System prompt with name ${editedSystemPrompt.name} already exists`
            };
        }

        const editResult = await this.systemPromptRepository.editSystemPrompt({ systemPrompt: editedSystemPrompt });

        if (!editResult.success) {
            return {
                success: false,
                systemPrompt: undefined,
                error: editResult.error || 'Failed to edit system prompt'
            };
        }

        return {
            success: true,
            systemPrompt: editedSystemPrompt
        };
    }

    private validate (params: EditSystemPromptParams): void {
        const { systemPrompt } = params;

        if (!systemPrompt.id) {
            throw new Error('System prompt id is required');
        }

        if (!systemPrompt.name?.trim()) {
            throw new Error('System prompt name is required');
        }

        if (!systemPrompt.content?.trim()) {
            throw new Error('System prompt content is required');
        }
    }
}
