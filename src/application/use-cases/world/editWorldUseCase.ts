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
        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }

        const { id, editParams } = params;
        const worldResponse = await this.worldRepository.getWorldById(id);
        if (!worldResponse.success) {
            this.logger.warning('EditWorldUseCase::execute - failed to load world', worldResponse.error);
            return { success: false, error: worldResponse.error };
        }

        const world = worldResponse.world;
        if (!world) {
            return {
                success: false,
                error: `World with id ${id} not found`
            };
        }

        this.logger.debug('Calling EditWorldService', { id, editParams });
        const response = this.service.editWorld({ world, editParams });
        this.logger.debug('EditWorldService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                error: response.error || 'An unknown error occurred on EditWorldService'
            };
        }

        if (!response.world) {
            return {
                success: false,
                error: 'Success is true but does not have a world'
            };
        }

        const editedWorld = response.world;
        const existingWorldsResponse = await this.worldRepository.getWorlds();
        if (!existingWorldsResponse.success || !existingWorldsResponse.worlds) {
            this.logger.warning('EditWorldUseCase::execute - failed to load worlds', existingWorldsResponse.error);
            return { success: false, error: existingWorldsResponse.error };
        }

        const existingWorlds = existingWorldsResponse.worlds;
        const duplicateWorld = existingWorlds.find(
            (w) => w.name === editedWorld.name && w.id !== editedWorld.id
        );

        if (duplicateWorld) {
            this.logger.warning(`World with name ${editedWorld.name} already exists`);
            return {
                success: false,
                error: `World with name ${editedWorld.name} already exists`
            };
        }

        const editResult = await this.worldRepository.editWorld({ world: editedWorld });
        if (!editResult.success) {
            return {
                success: false,
                error: editResult.error || 'Failed to edit world'
            };
        }

        return {
            id: editedWorld.id,
            success: true
        };
    }

    private validate (params: EditWorldParams): string | null {
        if (!params.id) {
            return 'An id is required to edit a world';
        }

        if (!params.editParams.name?.trim()) {
            return 'A name is required to edit a world';
        }

        if (!params.editParams.activationWord?.trim()) {
            return 'An activation word is required to edit a world';
        }

        if (!params.editParams.prompt?.trim()) {
            return 'A prompt is required to edit a world';
        }

        return null;
    }
}
