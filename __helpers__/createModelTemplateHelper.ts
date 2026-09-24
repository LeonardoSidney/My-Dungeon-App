import { ModelTemplate } from '@domain/entities';

export function createModelTemplateHelper (overrides?: Partial<ModelTemplate>): ModelTemplate {
    return {
        id: '1',
        modelId: 'model-a',
        connection: '10.0.0.1:8080',
        template: 'jinja template',
        hash: 'hash-a',
        editedByUser: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}
