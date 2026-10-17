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

    return {
        model: modelId,
        messages: [
            { role: 'system', content: systemPrompt },
            ...chat.map(c => mapToApplyTemplateChatMessage(c)),
        ],
    };
}

function mapToApplyTemplateChatMessage (chat: Chat): ApplyTemplateChatMessage {
    const message: ApplyTemplateChatMessage = {
        role: chat.role,
        content: chat.content[chat.index] ?? '',
    };

    if (chat.role !== RoleEnum.ASSISTANT) {
        return message;
    }

    const think = chat.think?.[chat.thinkIndex];

    if (!think || !think.enabled) {
        return message;
    }

    if (!think.content?.trim()) {
        return message;
    }

    return {
        ...message,
        reasoning_content: think.content,
    };
}
