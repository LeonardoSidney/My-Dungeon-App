import {
    createAssistantController,
    editAssistantController,
    getAssistantsController,
    getSamplersController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { ConnectionListItem } from '@domain/controllers';
import { Model } from '@domain/entities';
import { SeedAssistant } from './types';
import { MODEL_ID_PLACEHOLDER, nameIndex, listItems, MigrationReturn } from './shared';

type ResolveSeedModelReturn = {
    success: boolean;
    model?: Model;
    error?: string;
};

function resolveSeedModel (
    seed: SeedAssistant,
    models: Model[],
    connectionName: string
): ResolveSeedModelReturn {
    if (seed.modelId === MODEL_ID_PLACEHOLDER) {
        const firstModel = models[0];
        if (!firstModel) {
            return { success: false, error: `Migration: connection "${connectionName}" has no models` };
        }

        logger.info(`Migration: placeholder modelId resolved to "${firstModel.id}" for assistant "${seed.name}"`);
        return { success: true, model: firstModel };
    }

    const model = models.find(candidate => candidate.id === seed.modelId);
    if (!model) {
        return { success: false, error: `Migration: model "${seed.modelId}" is not loaded on connection "${connectionName}"` };
    }

    return { success: true, model };
}

export async function seedAssistants (
    seeds: SeedAssistant[],
    connection: ConnectionListItem,
    models: Model[]
): Promise<MigrationReturn> {
    const createAssistant = createAssistantController();
    const editAssistant = editAssistantController();
    const getAssistants = getAssistantsController();
    const getSamplers = getSamplersController();
    const samplersResponse = listItems(await getSamplers.handle(), 'samplers');
    if (!samplersResponse.success || !samplersResponse.items) {
        return { success: false, error: samplersResponse.error };
    }

    const samplers = samplersResponse.items;
    const existingResponse = listItems(await getAssistants.handle(), 'assistants');
    if (!existingResponse.success || !existingResponse.items) {
        return { success: false, error: existingResponse.error };
    }

    const existing = existingResponse.items;
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding assistants (${seeds.length} seed(s))`);

    const samplerIndex = nameIndex(samplers);

    for (const seed of seeds) {
        const modelResponse = resolveSeedModel(seed, models, connection.name);
        if (!modelResponse.success || !modelResponse.model) {
            return { success: false, error: modelResponse.error };
        }

        const model = modelResponse.model;

        const sampler = samplerIndex.get(seed.sampler);
        if (!sampler) {
            return { success: false, error: `Migration: sampler "${seed.sampler}" does not exist` };
        }

        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createAssistant.handle({
                name: seed.name,
                observation: seed.observation,
                modelId: model.id,
                samplerId: sampler.id,
                connectionId: connection.id,
            });
            if (!response.success) {
                return { success: false, error: `Migration: failed to create assistant "${seed.name}": ${response.error}` };
            }
            continue;
        }

        const response = await editAssistant.handle({
            id: current.id,
            editParams: {
                name: seed.name,
                observation: seed.observation,
                modelId: model.id,
                samplerId: sampler.id,
                connectionId: connection.id,
            },
        });
        if (!response.success) {
            return { success: false, error: `Migration: failed to restore assistant "${seed.name}": ${response.error}` };
        }
    }

    return { success: true };
}
