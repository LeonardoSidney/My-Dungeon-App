import { ILogger } from '@domain/logger';
import { IWorldRepository } from '@domain/repository';
import { IEditWorldService } from '@domain/services';
import { EditWorldParams, EditWorldReturn, IEditWorldUseCase } from '@domain/use-cases';

export class EditWorldUseCase implements IEditWorldUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditWorldService,
        private readonly worldRepository: IWorldRepository
    ) { }

    async execute (params: EditWorldParams): Promise<EditWorldReturn> {
        this.logger.info('Executing EditWorldUseCase::execute');
        this.validate(params);

        const { id, name, activationWord, prompt, observation, createdAt } = params;

        this.logger.debug('Calling EditWorldService', { id, name, activationWord, prompt, observation, createdAt });
        const response = this.service.editWorld({ id, name, activationWord, prompt, observation, createdAt });
        this.logger.debug('EditWorldService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                world: undefined,
                error: response.error || 'An unknown error occurred on EditWorldService'
            };
        }

        if (!response.world) {
            return {
                success: false,
                world: undefined,
                error: 'Success is true but does not have a world'
            };
        }

        const editedWorld = response.world;
        const existingWorlds = await this.worldRepository.getWorlds();
        const duplicateWorld = existingWorlds.find(
            (w) => w.name === editedWorld.name && w.id !== editedWorld.id
        );

        if (duplicateWorld) {
            this.logger.warning(`World with name ${editedWorld.name} already exists`);
            return {
                success: false,
                world: undefined,
                error: `World with name ${editedWorld.name} already exists`
            };
        }

        const editResult = await this.worldRepository.editWorld({ world: editedWorld });
        if (!editResult.success) {
            return {
                success: false,
                world: undefined,
                error: editResult.error || 'Failed to edit world'
            };
        }

        return {
            world: editedWorld,
            success: true
        };
    }

    private validate (params: EditWorldParams): void {
        if (!params.id) {
            throw new Error('An id is required to edit a world');
        }

        if (!params.name?.trim()) {
            throw new Error('A name is required to edit a world');
        }

        if (!params.activationWord?.trim()) {
            throw new Error('An activation word is required to edit a world');
        }

        if (!params.prompt?.trim()) {
            throw new Error('A prompt is required to edit a world');
        }
    }
}
