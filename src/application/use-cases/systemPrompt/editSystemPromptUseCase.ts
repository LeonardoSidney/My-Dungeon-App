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
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                systemPrompt: undefined,
                error: validationError
            };
        }

        const { id, editParams } = params;
        const systemPrompt = await this.systemPromptRepository.getSystemPromptById(id);
        if (!systemPrompt) {
            return {
                success: false,
                systemPrompt: undefined,
                error: `System prompt with id ${id} not found`
            };
        }

        this.logger.debug('Calling EditSystemPromptService', { id, editParams });
        const response = this.service.editSystemPrompt({ systemPrompt, editParams });
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

    private validate (params: EditSystemPromptParams): string | null {
        if (!params.id) {
            return 'System prompt id is required';
        }

        if (!params.editParams.name?.trim()) {
            return 'System prompt name is required';
        }

        if (!params.editParams.content?.trim()) {
            return 'System prompt content is required';
        }

        return null;
    }
}
