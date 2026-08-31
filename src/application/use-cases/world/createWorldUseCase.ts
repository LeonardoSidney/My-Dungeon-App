import { ILogger } from '@domain/logger';
import { IWorldRepository } from '@domain/repository';
import { ICreateWorldService } from '@domain/services';
import { CreateWorldUseCaseParams, CreateWorldUseCaseResponse, ICreateWorldUseCase } from '@domain/use-cases';

export class CreateWorldUseCase implements ICreateWorldUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly worldRepository: IWorldRepository,
        private readonly service: ICreateWorldService
    ) { }

    async execute (params: CreateWorldUseCaseParams): Promise<CreateWorldUseCaseResponse> {
        this.logger.info('Executing CreateWorldUseCase::execute');
        this.logger.debug('CreateWorldUseCase::execute - params:', params);

        const validationError = this.validate(params);
        if (validationError) {
            return {
                success: false,
                error: validationError
            };
        }

        const response = this.service.createWorld(params);
        this.logger.debug('CreateWorldService executed successfully', response);

        if (!response.success) {
            return {
                success: response.success,
                error: response.error
            };
        }

        if (!response.world) {
            return {
                success: false,
                error: 'Something went wrong when tried to create the world'
            };
        }

        const worlds = await this.worldRepository.getWorlds();
        this.logger.debug('WorldRepository executed successfully', worlds);
        const alreadyExists = worlds.find((world) => world.name === response.world?.name);

        if (alreadyExists) {
            this.logger.warning(`World with name ${response.world.name} already exists`);
            return {
                success: false,
                error: `World with name ${response.world.name} already exists`
            };
        }

        await this.worldRepository.saveWorld({ world: response.world });

        return {
            success: true,
            world: response.world
        };
    }

    private validate (params: CreateWorldUseCaseParams): string | null {
        if (!params.name?.trim()) {
            return 'Name is required to create a world';
        }

        if (!params.prompt?.trim()) {
            return 'Prompt is required to create a world';
        }

        if (!params.activationWord?.trim()) {
            return 'Activation word is required to create a world';
        }

        return null;
    }
}
