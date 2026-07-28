import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';
import { IEditAdventureService } from '@domain/services';
import { EditAdventureParams, EditAdventureReturn, IEditAdventureUseCase } from '@domain/use-cases';

export class EditAdventureUseCase implements IEditAdventureUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly service: IEditAdventureService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: EditAdventureParams): Promise<EditAdventureReturn> {
        this.logger.info('Executing EditAdventureUseCase::execute');
        this.validate(params);

        const { id, name, systemPrompts, characters, worldMaster, locations, worlds, items, chat, createdAt } = params;

        this.logger.debug('Calling EditAdventureService', { id, name, systemPrompts, characters, worldMaster, locations, worlds, items, chat, createdAt });
        const response = this.service.editAdventure({ id, name, systemPrompts, characters, worldMaster, locations, worlds, items, chat, createdAt: createdAt ?? new Date() });
        this.logger.debug('EditAdventureService executed successfully', response);

        if (!response.success) {
            return {
                success: false,
                adventure: undefined,
                error: response.error || 'An unknown error occurred on EditAdventureService'
            };
        }

        if (!response.adventure) {
            return {
                success: false,
                adventure: undefined,
                error: 'Success is true but does not have an adventure'
            };
        }

        const editedAdventure = response.adventure;
        const existingAdventures = await this.adventureRepository.getAdventures();
        const duplicateAdventure = existingAdventures.find(
            (a) => a.name === editedAdventure.name && a.id !== editedAdventure.id
        );

        if (duplicateAdventure) {
            this.logger.warning(`Adventure with name ${editedAdventure.name} already exists`);
            return {
                success: false,
                adventure: undefined,
                error: `Adventure with name ${editedAdventure.name} already exists`
            };
        }

        const editResult = await this.adventureRepository.updateAdventure({ adventure: editedAdventure });
        if (!editResult.success) {
            this.logger.error('Failed to save edited adventure');
            return {
                success: false,
                adventure: undefined,
                error: editResult.error || 'Failed to save edited adventure'
            };
        }

        return {
            success: true,
            adventure: editedAdventure
        };
    }

    private validate (params: EditAdventureParams): void {
        if (!params.id) {
            throw new Error('Adventure id is required');
        }
        if (!params.name?.trim()) {
            throw new Error('Adventure name is required');
        }
    }
}
