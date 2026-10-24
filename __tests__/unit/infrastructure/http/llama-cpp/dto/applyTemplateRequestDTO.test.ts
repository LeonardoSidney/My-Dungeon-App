import { mapToApplyTemplateRequest } from '@infra/http/llama-cpp/dto/applyTemplateRequestDTO';
import { RoleEnum } from '@domain/entities';
import { createChatHelper } from '@test/helpers';

describe('mapToApplyTemplateRequest', () => {
    it('sends the model and starts the messages with the system prompt', () => {
        expect(mapToApplyTemplateRequest({ modelId: 'model-a', systemPrompt: 'system', chat: [] })).toEqual({
            model: 'model-a',
            messages: [{ role: 'system', content: 'system' }]
        });
    });

    it('sends the selected content version of each chat', () => {
        const request = mapToApplyTemplateRequest({
            modelId: 'model-a',
            systemPrompt: 'system',
            chat: [
                createChatHelper({ role: RoleEnum.USER, content: ['old', 'new'], index: 1 }),
                createChatHelper({ role: RoleEnum.ASSISTANT, content: ['answer'] })
            ]
        });

        expect(request.messages.slice(1)).toEqual([
            { role: RoleEnum.USER, content: 'new' },
            { role: RoleEnum.ASSISTANT, content: 'answer' }
        ]);
    });

    it('sends an empty user message when the selected version does not exist', () => {
        const request = mapToApplyTemplateRequest({
            modelId: 'model-a',
            systemPrompt: 'system',
            chat: [createChatHelper({ role: RoleEnum.USER, content: [], index: 0 })]
        });

        expect(request.messages[1]).toEqual({ role: RoleEnum.USER, content: '' });
    });

    it('skips an assistant chat without content nor reasoning', () => {
        const request = mapToApplyTemplateRequest({
            modelId: 'model-a',
            systemPrompt: 'system',
            chat: [
                createChatHelper({ role: RoleEnum.USER, content: ['hello'] }),
                createChatHelper({ role: RoleEnum.ASSISTANT, content: ['   '] })
            ]
        });

        expect(request.messages).toEqual([
            { role: 'system', content: 'system' },
            { role: RoleEnum.USER, content: 'hello' }
        ]);
    });

    it('keeps an assistant chat without content when it has reasoning', () => {
        const request = mapToApplyTemplateRequest({
            modelId: 'model-a',
            systemPrompt: 'system',
            chat: [createChatHelper({
                role: RoleEnum.ASSISTANT,
                content: [''],
                think: [{ id: 'think-1', content: 'reasoning', enabled: true }]
            })]
        });

        expect(request.messages[1]).toEqual({ role: RoleEnum.ASSISTANT, content: '', reasoning_content: 'reasoning' });
    });

    it('omits reasoning that is disabled or blank', () => {
        const request = mapToApplyTemplateRequest({
            modelId: 'model-a',
            systemPrompt: 'system',
            chat: [
                createChatHelper({ role: RoleEnum.ASSISTANT, content: ['a'], think: [{ id: 't1', content: 'hidden', enabled: false }] }),
                createChatHelper({ role: RoleEnum.ASSISTANT, content: ['b'], think: [{ id: 't2', content: undefined, enabled: true }] }),
                createChatHelper({ role: RoleEnum.ASSISTANT, content: ['c'], think: [{ id: 't3', content: '  ', enabled: true }] })
            ]
        });

        expect(request.messages.slice(1)).toEqual([
            { role: RoleEnum.ASSISTANT, content: 'a' },
            { role: RoleEnum.ASSISTANT, content: 'b' },
            { role: RoleEnum.ASSISTANT, content: 'c' }
        ]);
    });
});
