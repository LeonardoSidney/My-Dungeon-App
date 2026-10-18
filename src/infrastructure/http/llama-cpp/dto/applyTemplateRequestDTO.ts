import { Chat, RoleEnum } from '@domain/entities';

export type ApplyTemplateChatMessage = {
    role: string;
    content: string;
    reasoning_content?: string;
};

export type ApplyTemplateRequest = {
    model: string;
    messages: ApplyTemplateChatMessage[];
};

export function mapToApplyTemplateRequest (params: {
    modelId: string;
    systemPrompt: string;
    chat: Chat[];
}): ApplyTemplateRequest {
    const { modelId, systemPrompt, chat } = params;

    const messages = chat
        .map(c => mapToApplyTemplateChatMessage(c))
        .filter((m): m is ApplyTemplateChatMessage => m !== null);

    return {
        model: modelId,
        messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
        ],
    };
}

function mapToApplyTemplateChatMessage (chat: Chat): ApplyTemplateChatMessage | null {
    const content = chat.content[chat.index] ?? '';

    if (chat.role !== RoleEnum.ASSISTANT) {
        return { role: chat.role, content };
    }

    const think = chat.think?.[chat.thinkIndex];

    if (think === undefined || !think.enabled || !think.content || think.content.trim() === '') {
        const hasContent = content.trim() !== '';
        if (!hasContent) {
            return null;
        }

        return { role: chat.role, content };
    }

    return {
        role: chat.role,
        content,
        reasoning_content: think.content,
    };
}
