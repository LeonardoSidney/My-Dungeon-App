import {
    createAssistantController,
    editAssistantController,
    getAssistantsController,
    getSamplersController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { Connection, Model } from '@domain/entities';
import { SeedAssistant } from './types';
import { MODEL_ID_PLACEHOLDER, nameIndex } from './shared';

function resolveSeedModel (
    seed: SeedAssistant,
    models: Model[],
    connectionName: string
): Model {
    if (seed.modelId === MODEL_ID_PLACEHOLDER) {
        const firstModel = models[0];
        if (!firstModel) {
            throw new Error(`Migration: connection "${connectionName}" has no models`);
        }

        logger.info(`Migration: placeholder modelId resolved to "${firstModel.id}" for assistant "${seed.name}"`);
        return firstModel;
    }

    const model = models.find(candidate => candidate.id === seed.modelId);
    if (!model) {
        throw new Error(`Migration: model "${seed.modelId}" is not loaded on connection "${connectionName}"`);
    }

    return model;
}

export async function seedAssistants (
    seeds: SeedAssistant[],
    connection: Connection,
    models: Model[]
): Promise<void> {
    const createAssistant = createAssistantController();
    const editAssistant = editAssistantController();
    const getAssistants = getAssistantsController();
    const getSamplers = getSamplersController();
    const samplers = await getSamplers.handle();
    const existing = await getAssistants.handle();
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding assistants (${seeds.length} seed(s))`);

    const samplerIndex = nameIndex(samplers);

    for (const seed of seeds) {
        const model = resolveSeedModel(seed, models, connection.name);

        const sampler = samplerIndex.get(seed.sampler);
        if (!sampler) {
            throw new Error(`Migration: sampler "${seed.sampler}" does not exist`);
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
                throw new Error(`Migration: failed to create assistant "${seed.name}": ${response.error}`);
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
            throw new Error(`Migration: failed to restore assistant "${seed.name}": ${response.error}`);
        }
    }
}
