import { ILogger } from '@domain/logger';
import { ITextGeneration, TurnPromptPurposeEnum } from '@domain/providers';
import { IModelProviderGateway } from '@domain/gateways';
import { ITurnSpeakerService, TurnSpeaker } from '@domain/services';
import {
    GetAdventureTemplatedPromptUseCaseParams,
    GetAdventureTemplatedPromptUseCaseResponse,
    HYDRATED_PARAM_KEY,
    HydratedAdventure,
    IGetAdventureTemplatedPromptUseCase,
    IGetSystemPromptLoadOrderUseCase,
    IHydrateAdventureUseCase,
    ResolveTemplatedPromptRequestReturn,
    SpeakerConnectionReturn,
} from '@domain/use-cases';

export class GetAdventureTemplatedPromptUseCase implements IGetAdventureTemplatedPromptUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly provider: ITextGeneration,
        private readonly gateway: IModelProviderGateway,
        private readonly hydrateAdventureUseCase: IHydrateAdventureUseCase,
        private readonly getSystemPromptLoadOrderUseCase: IGetSystemPromptLoadOrderUseCase,
        private readonly turnSpeakerService: ITurnSpeakerService
    ) { }

    async execute (params: GetAdventureTemplatedPromptUseCaseParams): Promise<GetAdventureTemplatedPromptUseCaseResponse> {
        this.logger.info('Executing GetAdventureTemplatedPromptUseCase::execute');
        this.logger.debug('Executing GetAdventureTemplatedPromptUseCase::execute - params', params);

        const requestResponse = await this.resolveRequest(params);
        if (!requestResponse.success || !requestResponse.request) {
            return { success: false, error: requestResponse.error ?? 'Failed to hydrate adventure' };
        }

        const loadOrderResponse = await this.getSystemPromptLoadOrderUseCase.execute();
        if (!loadOrderResponse.success || loadOrderResponse.loadOrder === undefined) {
            return { success: false, error: loadOrderResponse.error ?? 'Failed to load system prompt load order' };
        }

        const request = requestResponse.request;
        const hydrated = request.hydrated;
        const systemPromptResponse = this.provider.buildAdventureTextSystemPrompt(hydrated, loadOrderResponse.loadOrder);
        if (!systemPromptResponse.success || systemPromptResponse.systemPrompt === undefined) {
            this.logger.warning('GetAdventureTemplatedPromptUseCase::execute - failed to build system prompt', systemPromptResponse.error);
            return { success: false, error: systemPromptResponse.error };
        }

        const systemPrompt = systemPromptResponse.systemPrompt;
        this.logger.debug('Executing GetAdventureTemplatedPromptUseCase:execute - systemPrompt', systemPrompt);

        const turnMessagesResponse = this.provider.buildAdventureTurnMessages(request);
        if (!turnMessagesResponse.success || !turnMessagesResponse.messages) {
            this.logger.warning('GetAdventureTemplatedPromptUseCase::execute - failed to build turn messages', turnMessagesResponse.error);
            return { success: false, error: turnMessagesResponse.error ?? 'Failed to build turn messages' };
        }

        const runtime = this.getSpeakerConnection(hydrated, request.speaker);
        if (!runtime.success || !runtime.connection || !runtime.modelId) {
            this.logger.warning('GetAdventureTemplatedPromptUseCase::execute - failed to resolve speaker runtime', runtime.error);
            return { success: false, error: runtime.error };
        }

        this.logger.debug('Executing GetAdventureTemplatedPromptUseCase::execute - calling applyTemplate');
        const templateResponse = await this.gateway.applyTemplate({
            connection: runtime.connection,
            modelId: runtime.modelId,
            systemPrompt,
            messages: turnMessagesResponse.messages,
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

    private async resolveRequest (params: GetAdventureTemplatedPromptUseCaseParams): Promise<ResolveTemplatedPromptRequestReturn> {
        if (HYDRATED_PARAM_KEY in params) {
            return { success: true, request: params };
        }

        const hydratedResponse = await this.hydrateAdventureUseCase.execute({ adventureId: params.adventureId });
        if (!hydratedResponse.success || !hydratedResponse.hydrated) {
            return { success: false, error: hydratedResponse.error };
        }

        const hydrated = hydratedResponse.hydrated;
        const nextSpeaker = this.turnSpeakerService.resolveNextSpeaker(hydrated);
        if (!nextSpeaker.success) {
            return { success: false, error: nextSpeaker.error };
        }

        const speakerResponse = nextSpeaker.speaker
            ? nextSpeaker
            : this.turnSpeakerService.resolveWorldMaster(hydrated);
        if (!speakerResponse.success || !speakerResponse.speaker) {
            return { success: false, error: speakerResponse.error };
        }

        return {
            success: true,
            request: { hydrated, speaker: speakerResponse.speaker, purpose: TurnPromptPurposeEnum.REPLY },
        };
    }

    private getSpeakerConnection (hydrated: HydratedAdventure, speaker: TurnSpeaker): SpeakerConnectionReturn {
        const assistant = hydrated.assistants[speaker.assistantId];
        if (!assistant) {
            return { success: false, error: `Assistant not found: ${speaker.assistantId}` };
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
