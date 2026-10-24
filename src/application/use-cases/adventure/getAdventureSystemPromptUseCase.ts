import { ILogger } from '@domain/logger';
import { ITextGeneration } from '@domain/providers';
import { IAdventureRepository } from '@domain/repository';
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
        private readonly hydrateAdventureService: IHydrateAdventureService,
        private readonly adventureRepository: IAdventureRepository
    ) { }

    async execute (params: GetAdventureSystemPromptUseCaseParams): Promise<GetAdventureSystemPromptUseCaseResponse> {
        this.logger.info('Executing GetAdventureSystemPromptUseCase::execute');
        this.logger.debug('Executing GetAdventureSystemPromptUseCase::execute - params', params);

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const adventureResponse = await this.adventureRepository.getAdventureById(params.adventureId);
        if (!adventureResponse.success) {
            this.logger.warning('GetAdventureSystemPromptUseCase::execute - failed to load adventure', adventureResponse.error);
            return { success: false, error: adventureResponse.error };
        }

        const adventure = adventureResponse.adventure;
        if (!adventure) {
            return { success: false, error: `Adventure with id ${params.adventureId} not found` };
        }

        const hydrateResponse = await this.hydrateAdventureService.hydrate({ adventure });

        if (!hydrateResponse.success || !hydrateResponse.hydrated) {
            this.logger.warning('GetAdventureSystemPromptUseCase::execute - failed to hydrate adventure', hydrateResponse.error);
            return {
                success: false,
                error: hydrateResponse.error ?? 'Failed to hydrate adventure',
            };
        }

        const systemPromptResponse = this.provider.buildAdventureTextSystemPrompt(hydrateResponse.hydrated);
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

    private validate (params: GetAdventureSystemPromptUseCaseParams): string | null {
        if (!params.adventureId.trim()) {
            return 'Adventure id is required';
        }

        return null;
    }
}
