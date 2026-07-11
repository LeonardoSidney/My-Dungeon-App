import { ILogger } from '@domain/logger';
import { ITextGeneration } from '@domain/providers';
import { IModelProviderGateway } from '@domain/gateways';
import { Model, Character, WorldMaster } from '@domain/entities';
import { GetAdventureTextUseCaseParams, GetAdventureTextUseCaseResponse, IGetAdventureTextUseCase } from '@domain/use-cases';

export class GetAdventureTextUseCase implements IGetAdventureTextUseCase {
    constructor(
        private readonly logger: ILogger,
        private readonly provider: ITextGeneration,
        private readonly gateway: IModelProviderGateway
    ) { }

    async execute(params: GetAdventureTextUseCaseParams): Promise<GetAdventureTextUseCaseResponse> {
        this.logger.info('Executing GetAdventureTextUseCase::execute');
        this.logger.debug('Executing GetAdventureTextUseCase::execute - params', params);

        const systemPrompt = this.provider.buildAdventureTextSystemPrompt(params.adventure);
        this.logger.debug('Executing GetAdventureTextUseCase:execute - systemPrompt', systemPrompt);

        const model = this.getWorldMasterModel(params.adventure.worldMaster, params.adventure.characters);
        const connection = model.connection;

        this.logger.debug('Executing GetAdventureTextUseCase::execute - calling applyTemplate');
        const templateResponse = await this.gateway.applyTemplate(
            connection,
            model.id,
            systemPrompt,
            params.adventure.chat
        );

        this.logger.debug('Executing GetAdventureTextUseCase::execute - templateResponse', templateResponse);

        if (!templateResponse) {
            throw new Error('Can not generate response');
        }

        return {
            success: true,
            prompt: templateResponse.prompt
        };
    }

    private getWorldMasterModel(worldMaster: WorldMaster | undefined, characters: Character[]): Model {
        if (worldMaster) {
            return worldMaster.assistant.model;
        }

        const worldMasterCharacter = characters.find(c => c.worldMaster === true);
        if (!worldMasterCharacter) {
            this.logger.warning('Executing GetAdventureTextUseCase::getWorldMasterModel - worldMaster character not found');
            throw new Error('WorldMaster character not found');
        }

        return worldMasterCharacter.assistant.model;
    }
}
