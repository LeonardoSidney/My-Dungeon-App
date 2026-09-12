import { ILogger } from '@domain/logger';
import { ITextGeneration } from '@domain/providers';
import { IHydrateAdventureService } from '@domain/services';
import {
    GetAdventureSystemPromptUseCaseParams,
    GetAdventureSystemPromptUseCaseResponse,
    IGetAdventureSystemPromptUseCase,
} from '@domain/use-cases';

export class GetAdventureSystemPromptUseCase implements IGetAdventureSystemPromptUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly provider: ITextGeneration,
        private readonly hydrateAdventureService: IHydrateAdventureService
    ) { }

    async execute (params: GetAdventureSystemPromptUseCaseParams): Promise<GetAdventureSystemPromptUseCaseResponse> {
        this.logger.info('Executing GetAdventureSystemPromptUseCase::execute');
        this.logger.debug('Executing GetAdventureSystemPromptUseCase::execute - params', params);

        try {
            const hydrateResponse = await this.hydrateAdventureService.hydrate({ adventure: params.adventure });

            if (!hydrateResponse.success || !hydrateResponse.hydrated) {
                this.logger.warning('GetAdventureSystemPromptUseCase::execute - failed to hydrate adventure', hydrateResponse.error);
                return {
                    success: false,
                    error: hydrateResponse.error ?? 'Failed to hydrate adventure',
                };
            }

            const systemPrompt = this.provider.buildAdventureTextSystemPrompt(hydrateResponse.hydrated);
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
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error('Error in GetAdventureSystemPromptUseCase::execute', error);
                return {
                    success: false,
                    error: error.message,
                };
            }

            this.logger.error('Error in GetAdventureSystemPromptUseCase::execute', error);
            return {
                success: false,
                error: 'Get adventure system prompt failed',
            };
        }
    }
}
