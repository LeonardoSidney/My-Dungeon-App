import { RoleEnum } from '@domain/entities';
import type { ModelProviderGateway } from '@domain/gateways';

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
    messages: ModelProviderGateway.TemplateMessage[];
}): ApplyTemplateRequest {
    const { modelId, systemPrompt, messages } = params;

    return {
        model: modelId,
        messages: [
            { role: RoleEnum.SYSTEM, content: systemPrompt },
            ...messages.map(message => mapToApplyTemplateChatMessage(message)),
        ],
    };
}

function mapToApplyTemplateChatMessage (message: ModelProviderGateway.TemplateMessage): ApplyTemplateChatMessage {
    if (message.reasoning === undefined) {
        return { role: message.role, content: message.content };
    }

    return {
        role: message.role,
        content: message.content,
        reasoning_content: message.reasoning,
    };
}
