import { ILogger } from '@domain/logger';
import { ITextGeneration } from '@domain/providers';
import { IModelProviderGateway } from '@domain/gateways';
import { IAdventureRepository } from '@domain/repository';
import { IHydrateAdventureService } from '@domain/services';
import {
    GetAdventureTemplatedPromptUseCaseParams,
    GetAdventureTemplatedPromptUseCaseResponse,
    HydratedAdventure,
    IGetAdventureTemplatedPromptUseCase,
    ResolveHydratedReturn,
    WorldMasterRuntimeReturn,
} from '@domain/use-cases';

export class GetAdventureTemplatedPromptUseCase implements IGetAdventureTemplatedPromptUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly provider: ITextGeneration,
        private readonly gateway: IModelProviderGateway,
        private readonly hydrateAdventureService: IHydrateAdventureService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: GetAdventureTemplatedPromptUseCaseParams): Promise<GetAdventureTemplatedPromptUseCaseResponse> {
        this.logger.info('Executing GetAdventureTemplatedPromptUseCase::execute');
        this.logger.debug('Executing GetAdventureTemplatedPromptUseCase::execute - params', params);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const hydratedResponse = await this.resolveHydrated(params);
        if (!hydratedResponse.success || !hydratedResponse.hydrated) {
            return { success: false, error: hydratedResponse.error };
        }

        const hydrated = hydratedResponse.hydrated;
        const systemPromptResponse = this.provider.buildAdventureTextSystemPrompt(hydrated);
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

    private validate (params: GetAdventureTemplatedPromptUseCaseParams): string | null {
        if ('adventureId' in params && !params.adventureId.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }

    private async resolveHydrated (params: GetAdventureTemplatedPromptUseCaseParams): Promise<ResolveHydratedReturn> {
        if ('hydrated' in params) {
            return { success: true, hydrated: params.hydrated };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('GetAdventureTemplatedPromptUseCase::resolveHydrated - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: 'Failed to hydrate adventure' };
        }

        const hydrateResponse = await this.hydrateAdventureService.hydrate({ adventure });

        if (!hydrateResponse.success || !hydrateResponse.hydrated) {
            this.logger.warning('GetAdventureTemplatedPromptUseCase::resolveHydrated - failed to hydrate adventure', hydrateResponse.error);
            return { success: false, error: 'Failed to hydrate adventure' };
        }

        return { success: true, hydrated: hydrateResponse.hydrated };
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
