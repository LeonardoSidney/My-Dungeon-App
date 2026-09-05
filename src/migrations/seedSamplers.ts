import {
    createSamplerController,
    editSamplerController,
    getSamplersController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { SeedSampler } from './types';
import { nameIndex } from './shared';

export async function seedSamplers (seeds: SeedSampler[]): Promise<void> {
    const createSampler = createSamplerController();
    const editSampler = editSamplerController();
    const getSamplers = getSamplersController();
    const existing = await getSamplers.handle();
    const existingIndex = nameIndex(existing);
    logger.info(`Migration: seeding samplers (${seeds.length} seed(s))`);

    for (const seed of seeds) {
        const current = existingIndex.get(seed.name);
        if (!current) {
            const response = await createSampler.handle(seed);
            if (!response.success) {
                throw new Error(`Migration: failed to create sampler "${seed.name}": ${response.error}`);
            }
            continue;
        }

        if (current.systemDefault) {
            logger.info(`Migration: sampler "${seed.name}" is a system default, skipping restore`);
            continue;
        }

        const response = await editSampler.handle({
            id: current.id,
            editParams: {
                name: seed.name,
                observation: seed.observation,
                systemDefault: false,
                adaptativeDecay: seed.adaptativeDecay,
                adaptativeTarget: seed.adaptativeTarget,
                dryAllowedLenght: seed.dryAllowedLenght,
                dryBase: seed.dryBase,
                dryMultiplier: seed.dryMultiplier,
                drySequenceBreakers: seed.drySequenceBreakers,
                dynaTempExp: seed.dynaTempExp,
                dynaTempRange: seed.dynaTempRange,
                ignoreEOS: seed.ignoreEOS,
                minP: seed.minP,
                mirostat: seed.mirostat,
                mirostatEnt: seed.mirostatEnt,
                mirostatLr: seed.mirostatLr,
                frequencyPenalty: seed.frequencyPenalty,
                presencePenalty: seed.presencePenalty,
                repeatLastN: seed.repeatLastN,
                repeatPenalty: seed.repeatPenalty,
                seed: seed.seed,
                temperature: seed.temperature,
                topK: seed.topK,
                topNSigma: seed.topNSigma,
                topP: seed.topP,
                typicalP: seed.typicalP,
                xtcProbability: seed.xtcProbability,
                xtcThreshould: seed.xtcThreshould,
            },
        });
        if (!response.success) {
            throw new Error(`Migration: failed to restore sampler "${seed.name}": ${response.error}`);
        }
    }
}
