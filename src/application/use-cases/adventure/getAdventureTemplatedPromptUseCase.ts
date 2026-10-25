import { ILogger } from '@domain/logger';
import { ITextGeneration } from '@domain/providers';
import { IModelProviderGateway } from '@domain/gateways';
import {
    GetAdventureTemplatedPromptUseCaseParams,
    GetAdventureTemplatedPromptUseCaseResponse,
    HYDRATED_PARAM_KEY,
    HydratedAdventure,
    IGetAdventureTemplatedPromptUseCase,
    IGetSystemPromptLoadOrderUseCase,
    IHydrateAdventureUseCase,
    ResolveHydratedReturn,
    WorldMasterRuntimeReturn,
} from '@domain/use-cases';

export class GetAdventureTemplatedPromptUseCase implements IGetAdventureTemplatedPromptUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly provider: ITextGeneration,
        private readonly gateway: IModelProviderGateway,
        private readonly hydrateAdventureUseCase: IHydrateAdventureUseCase,
        private readonly getSystemPromptLoadOrderUseCase: IGetSystemPromptLoadOrderUseCase
    ) { }

    async execute (params: GetAdventureTemplatedPromptUseCaseParams): Promise<GetAdventureTemplatedPromptUseCaseResponse> {
        this.logger.info('Executing GetAdventureTemplatedPromptUseCase::execute');
        this.logger.debug('Executing GetAdventureTemplatedPromptUseCase::execute - params', params);

        const hydratedResponse = await this.resolveHydrated(params);
        if (!hydratedResponse.success || !hydratedResponse.hydrated) {
            return { success: false, error: hydratedResponse.error ?? 'Failed to hydrate adventure' };
        }

        const loadOrderResponse = await this.getSystemPromptLoadOrderUseCase.execute();
        if (!loadOrderResponse.success || loadOrderResponse.loadOrder === undefined) {
            return { success: false, error: loadOrderResponse.error ?? 'Failed to load system prompt load order' };
        }

        const hydrated = hydratedResponse.hydrated;
        const systemPromptResponse = this.provider.buildAdventureTextSystemPrompt(hydrated, loadOrderResponse.loadOrder);
        if (!systemPromptResponse.success || systemPromptResponse.systemPrompt === undefined) {
            this.logger.warning('GetAdventureTemplatedPromptUseCase::execute - failed to build system prompt', systemPromptResponse.error);
            return { success: false, error: systemPromptResponse.error };
        }

        const systemPrompt = systemPromptResponse.systemPrompt;
        this.logger.debug('Executing GetAdventureTemplatedPromptUseCase:execute - systemPrompt', systemPrompt);

        const runtime = this.getWorldMasterRuntime(hydrated);
        if (!runtime.success || !runtime.connection || !runtime.modelId) {
            this.logger.warning('GetAdventureTemplatedPromptUseCase::execute - failed to resolve world master runtime', runtime.error);
            return { success: false, error: runtime.error };
        }

        this.logger.debug('Executing GetAdventureTemplatedPromptUseCase::execute - calling applyTemplate');
        const templateResponse = await this.gateway.applyTemplate({
            connection: runtime.connection,
            modelId: runtime.modelId,
            systemPrompt,
            chat: hydrated.adventure.chat
        });

        this.logger.debug('Executing GetAdventureTemplatedPromptUseCase:execute - prompt', templateResponse.prompt);

        if (!templateResponse.success || !templateResponse.prompt) {
            this.logger.warning('GetAdventureTemplatedPromptUseCase::execute - failed to apply template', templateResponse.error);
            return {
                success: false,
                error: templateResponse.error ?? 'Model did not return a prompt',
            };
        }

        return {
            success: true,
            prompt: templateResponse.prompt
        };
    }

    private async resolveHydrated (params: GetAdventureTemplatedPromptUseCaseParams): Promise<ResolveHydratedReturn> {
        if (HYDRATED_PARAM_KEY in params) {
            return { success: true, hydrated: params.hydrated };
        }

        return this.hydrateAdventureUseCase.execute({ adventureId: params.adventureId });
    }

    private getWorldMasterRuntime (hydrated: HydratedAdventure): WorldMasterRuntimeReturn {
        const dedicatedWorldMaster = hydrated.worldMaster;
        const worldMasterCharacter = dedicatedWorldMaster
            ? undefined
            : hydrated.characters.find(c => c.worldMaster === true);

        const assistantId = dedicatedWorldMaster
            ? dedicatedWorldMaster.assistantId
            : worldMasterCharacter?.assistantId;

        if (!assistantId) {
            return { success: false, error: 'WorldMaster not found' };
        }

        const assistant = hydrated.assistants[assistantId];
        if (!assistant) {
            return { success: false, error: `Assistant not found: ${assistantId}` };
        }

        const connection = hydrated.connections.find(c => c.id === assistant.connectionId);
        if (!connection) {
            return { success: false, error: `Connection not found: ${assistant.connectionId}` };
        }

        return {
            success: true,
            connection,
            modelId: assistant.modelId,
        };
    }
}
