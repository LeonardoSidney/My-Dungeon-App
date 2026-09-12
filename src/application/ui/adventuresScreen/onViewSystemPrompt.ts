import { Adventure } from '@domain/entities';
import { IGetAdventureTextController, IGetAdventureSystemPromptController } from '@domain/controllers';

export type SystemPromptViewData = {
    adventure: Adventure;
    systemPrompt?: string;
    systemPromptError?: string;
    finalPrompt?: string;
    finalPromptError?: string;
};

export async function onViewSystemPrompt (
    getAdventureSystemPrompt: IGetAdventureSystemPromptController,
    getAdventureText: IGetAdventureTextController,
    adventure: Adventure
): Promise<SystemPromptViewData> {
    const [systemPromptResponse, finalPromptResponse] = await Promise.all([
        getAdventureSystemPrompt.handle({ adventure }),
        getAdventureText.handle({ adventure }),
    ]);
    return {
        adventure,
        systemPrompt: systemPromptResponse.success ? systemPromptResponse.systemPrompt : undefined,
        systemPromptError: systemPromptResponse.success ? undefined : systemPromptResponse.error,
        finalPrompt: finalPromptResponse.success ? finalPromptResponse.prompt : undefined,
        finalPromptError: finalPromptResponse.success ? undefined : finalPromptResponse.error,
    };
}
