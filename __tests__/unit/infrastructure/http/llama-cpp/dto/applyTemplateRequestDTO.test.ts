import { mapToApplyTemplateRequest } from '@infra/http/llama-cpp/dto/applyTemplateRequestDTO';
import { RoleEnum } from '@domain/entities';

describe('mapToApplyTemplateRequest', () => {
    it('sends the model and starts the messages with the system prompt', () => {
        expect(mapToApplyTemplateRequest({ modelId: 'model-a', systemPrompt: 'system', messages: [] })).toEqual({
            model: 'model-a',
            messages: [{ role: 'system', content: 'system' }]
        });
    });

    it('sends each message with its role and content in order', () => {
        const request = mapToApplyTemplateRequest({
            modelId: 'model-a',
            systemPrompt: 'system',
            messages: [
                { role: RoleEnum.USER, content: 'turn' },
                { role: RoleEnum.ASSISTANT, content: 'answer' }
            ]
        });

        expect(request.messages.slice(1)).toEqual([
            { role: RoleEnum.USER, content: 'turn' },
            { role: RoleEnum.ASSISTANT, content: 'answer' }
        ]);
    });

    it('sends the reasoning of a message as reasoning_content', () => {
        const request = mapToApplyTemplateRequest({
            modelId: 'model-a',
            systemPrompt: 'system',
            messages: [{ role: RoleEnum.ASSISTANT, content: '', reasoning: 'reasoning' }]
        });

        expect(request.messages[1]).toEqual({ role: RoleEnum.ASSISTANT, content: '', reasoning_content: 'reasoning' });
    });

    it('does not send reasoning_content when the message has no reasoning', () => {
        const request = mapToApplyTemplateRequest({
            modelId: 'model-a',
            systemPrompt: 'system',
            messages: [{ role: RoleEnum.ASSISTANT, content: 'answer' }]
        });

        expect(request.messages[1]).not.toHaveProperty('reasoning_content');
    });
});
