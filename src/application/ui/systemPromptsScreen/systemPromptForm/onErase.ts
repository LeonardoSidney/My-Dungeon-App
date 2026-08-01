import { eraseSystemPromptController } from '@infra/container';

export async function onErase (systemPromptId: string) {
    const controller = eraseSystemPromptController();
    return controller.handle(systemPromptId);
}
