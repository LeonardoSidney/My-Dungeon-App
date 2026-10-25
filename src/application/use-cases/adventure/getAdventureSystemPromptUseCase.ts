import { ILogger } from '@domain/logger';
import { ITextGeneration } from '@domain/providers';
import {
    GetAdventureSystemPromptUseCaseParams,
    GetAdventureSystemPromptUseCaseResponse,
    IGetAdventureSystemPromptUseCase,
    IGetSystemPromptLoadOrderUseCase,
    IHydrateAdventureUseCase,
} from '@domain/use-cases';

export class GetAdventureSystemPromptUseCase implements IGetAdventureSystemPromptUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly provider: ITextGeneration,
        private readonly hydrateAdventureUseCase: IHydrateAdventureUseCase,
        private readonly getSystemPromptLoadOrderUseCase: IGetSystemPromptLoadOrderUseCase
    ) { }

    async execute (params: GetAdventureSystemPromptUseCaseParams): Promise<GetAdventureSystemPromptUseCaseResponse> {
        this.logger.info('Executing GetAdventureSystemPromptUseCase::execute');
        this.logger.debug('Executing GetAdventureSystemPromptUseCase::execute - params', params);

        const hydrateResponse = await this.hydrateAdventureUseCase.execute({ adventureId: params.adventureId });
        if (!hydrateResponse.success || !hydrateResponse.hydrated) {
            return {
                success: false,
                error: hydrateResponse.error ?? 'Failed to hydrate adventure',
            };
        }

        const loadOrderResponse = await this.getSystemPromptLoadOrderUseCase.execute();
        if (!loadOrderResponse.success || loadOrderResponse.loadOrder === undefined) {
            return { success: false, error: loadOrderResponse.error ?? 'Failed to load system prompt load order' };
        }

        const systemPromptResponse = this.provider.buildAdventureTextSystemPrompt(hydrateResponse.hydrated, loadOrderResponse.loadOrder);
        if (!systemPromptResponse.success || systemPromptResponse.systemPrompt === undefined) {
            this.logger.warning('GetAdventureSystemPromptUseCase::execute - failed to build system prompt', systemPromptResponse.error);
            return { success: false, error: systemPromptResponse.error };
        }

        const systemPrompt = systemPromptResponse.systemPrompt;
        this.logger.debug('Executing GetAdventureSystemPromptUseCase::execute - systemPrompt', systemPrompt);

        if (!systemPrompt.trim()) {
            return {
                success: false,
                error: 'System prompt is empty',
            };
        }

        return {
            success: true,
            systemPrompt,
        };
    }
}
