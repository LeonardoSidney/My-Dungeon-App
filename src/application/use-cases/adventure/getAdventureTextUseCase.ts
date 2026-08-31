import { ILogger } from '@domain/logger';
import { ITextGeneration } from '@domain/providers';
import { IModelProviderGateway } from '@domain/gateways';
import { Connection } from '@domain/entities';
import {
    GetAdventureTextUseCaseParams,
    GetAdventureTextUseCaseResponse,
    HydratedAdventure,
    IGetAdventureTextUseCase,
    IHydrateAdventureUseCase,
} from '@domain/use-cases';

export class GetAdventureTextUseCase implements IGetAdventureTextUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly provider: ITextGeneration,
        private readonly gateway: IModelProviderGateway,
        private readonly hydrateAdventureUseCase: IHydrateAdventureUseCase
    ) { }

    async execute (params: GetAdventureTextUseCaseParams): Promise<GetAdventureTextUseCaseResponse> {
        this.logger.info('Executing GetAdventureTextUseCase::execute');
        this.logger.debug('Executing GetAdventureTextUseCase::execute - params', params);

        try {
            const hydrateResponse = await this.hydrateAdventureUseCase.execute({ adventure: params.adventure });

            if (!hydrateResponse.success || !hydrateResponse.hydrated) {
                this.logger.warning('GetAdventureTextUseCase::execute - failed to hydrate adventure', hydrateResponse.error);
                return {
                    success: false,
                    error: hydrateResponse.error ?? 'Failed to hydrate adventure',
                };
            }

            const hydrated = hydrateResponse.hydrated;
            const systemPrompt = this.provider.buildAdventureTextSystemPrompt(hydrated);
            this.logger.debug('Executing GetAdventureTextUseCase:execute - systemPrompt', systemPrompt);

            const { connection, modelId } = this.getWorldMasterRuntime(hydrated);

            this.logger.debug('Executing GetAdventureTextUseCase::execute - calling applyTemplate');
            const prompt = await this.gateway.applyTemplate(
                connection,
                modelId,
                systemPrompt,
                params.adventure.chat
            );

            this.logger.debug('Executing GetAdventureTextUseCase:execute - prompt', prompt);

            if (!prompt) {
                return {
                    success: false,
                    error: 'Can not generate response',
                };
            }

            return {
                success: true,
                prompt
            };
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in GetAdventureTextUseCase::execute', error);
                return {
                    success: false,
                    error: error.message,
                };
            }

            this.logger.error('Error in GetAdventureTextUseCase::execute', error);
            return {
                success: false,
                error: 'Get adventure text failed',
            };
        }
    }

    private getWorldMasterRuntime (hydrated: HydratedAdventure): { connection: Connection; modelId: string; } {
        const dedicatedWorldMaster = hydrated.worldMaster;
        const worldMasterCharacter = dedicatedWorldMaster
            ? undefined
            : hydrated.characters.find(c => c.worldMaster === true);

        const assistantId = dedicatedWorldMaster
            ? dedicatedWorldMaster.assistantId
            : worldMasterCharacter?.assistantId;

        if (!assistantId) {
            this.logger.warning('GetAdventureTextUseCase::getWorldMasterRuntime - worldMaster not found');
            throw new Error('WorldMaster not found');
        }

        const assistant = hydrated.assistants[assistantId];

        if (!assistant) {
            throw new Error(`Assistant not found: ${assistantId}`);
        }

        const connection = hydrated.connections.find(c => c.id === assistant.connectionId);
        if (!connection) {
            throw new Error(`Connection not found: ${assistant.connectionId}`);
        }

        return {
            connection,
            modelId: assistant.modelId,
        };
    }
}
