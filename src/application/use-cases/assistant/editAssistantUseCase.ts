import { ILogger } from '@domain/logger';
import { IAssistantRepository } from '@domain/repository';
import { IEditAssistantService } from '@domain/services';
import { EditAssistantParams, EditAssistantReturn, IEditAssistantUseCase } from '@domain/use-cases';

export class EditAssistantUseCase implements IEditAssistantUseCase {
  constructor (
    private readonly logger: ILogger,
    private readonly service: IEditAssistantService,
    private readonly assistantRepository: IAssistantRepository
  ) { }

  async execute (params: EditAssistantParams): Promise<EditAssistantReturn> {
    this.logger.info('Executing EditAssistantUseCase::execute');
    this.validate(params);

    const { id, name, observation, model, sampler, createdAt } = params;

    this.logger.debug('Calling EditAssistantService', { id, name, observation, model, sampler, createdAt });
    const response = this.service.editAssistant({ id, name, observation, model, sampler, createdAt });
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

  private validate (params: EditAssistantParams): void {
    if (!params.id) {
      throw new Error('An id is required to edit an assistant');
    }

    if (!params.name?.trim()) {
      throw new Error('A name is required to edit an assistant');
    }
  }
}
