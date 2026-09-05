import {
    createSystemPromptController,
    editSystemPromptController,
    getSystemPromptsController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedSystemPrompt } from './types';
import { nameIndex } from './shared';

export async function seedSystemPrompts (seeds: SeedSystemPrompt[]): Promise<void> {
    const createSystemPrompt = createSystemPromptController();
    const editSystemPrompt = editSystemPromptController();
    const getSystemPrompts = getSystemPromptsController();
    const existing = await getSystemPrompts.handle();
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding system prompts (${seeds.length} seed(s))`);

    for (const seed of seeds) {
        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createSystemPrompt.handle(seed);
            if (!response.success) {
                throw new Error(`Migration: failed to create system prompt "${seed.name}": ${response.error}`);
            }
            continue;
        }

        const response = await editSystemPrompt.handle({
            id: current.id,
            editParams: {
                name: seed.name,
                content: seed.content,
                observation: seed.observation,
            },
        });
        if (!response.success) {
            throw new Error(`Migration: failed to restore system prompt "${seed.name}": ${response.error}`);
        }
    }
}
