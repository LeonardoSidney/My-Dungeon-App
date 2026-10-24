import { mapSamplerToNativePayload } from '@infra/http/llama-cpp/llamaCppNativeGateway/dto/samplerToNativePayload';
import { MirostatEnum } from '@domain/entities';
import { createSamplerHelper } from '@test/helpers';

describe('mapSamplerToNativePayload', () => {
    it('sends only the defaults when the sampler sets nothing', () => {
        expect(mapSamplerToNativePayload(createSamplerHelper(), 'model-a', 'Once upon')).toEqual({
            model: 'model-a',
            prompt: 'Once upon',
            temperature: 0.8,
            top_k: 40,
            top_p: 0.95,
            min_p: 0.05,
            seed: -1,
            stream: true
        });
    });

    it('maps every parameter the sampler sets', () => {
        const sampler = createSamplerHelper({
            temperature: 0.7,
            topK: 50,
            topP: 0.9,
            minP: 0.1,
            typicalP: 0.8,
            repeatPenalty: 1.1,
            repeatLastN: 64,
            presencePenalty: 0.2,
            frequencyPenalty: 0.3,
            dryMultiplier: 0.8,
            dryBase: 1.75,
            dryAllowedLenght: 2,
            drySequenceBreakers: '\n":*',
            xtcProbability: 0.5,
            xtcThreshould: 0.1,
            mirostat: MirostatEnum.MIROSTAT2,
            mirostatEnt: 5,
            mirostatLr: 0.1,
            seed: '42',
            ignoreEOS: true
        });

        expect(mapSamplerToNativePayload(sampler, 'model-a', 'Once upon')).toEqual({
            model: 'model-a',
            prompt: 'Once upon',
            temperature: 0.7,
            top_k: 50,
            top_p: 0.9,
            min_p: 0.1,
            stream: true,
            typical_p: 0.8,
            repeat_penalty: 1.1,
            repeat_last_n: 64,
            presence_penalty: 0.2,
            frequency_penalty: 0.3,
            dry_multiplier: 0.8,
            dry_base: 1.75,
            dry_allowed_length: 2,
            dry_sequence_breakers: ['\n', '"', ':', '*'],
            xtc_probability: 0.5,
            xtc_threshold: 0.1,
            mirostat: MirostatEnum.MIROSTAT2,
            mirostat_tau: 5,
            mirostat_eta: 0.1,
            seed: 42,
            ignore_eos: true
        });
    });

    it('sends mirostat without tau nor eta when the sampler does not set them', () => {
        const payload = mapSamplerToNativePayload(createSamplerHelper({ mirostat: MirostatEnum.MIROSTAT1 }), 'model-a', 'Once upon');

        expect(payload.mirostat).toBe(MirostatEnum.MIROSTAT1);
        expect(payload).not.toHaveProperty('mirostat_tau');
        expect(payload).not.toHaveProperty('mirostat_eta');
    });

    it('ignores mirostat tau and eta without a mirostat mode', () => {
        const payload = mapSamplerToNativePayload(createSamplerHelper({ mirostatEnt: 5, mirostatLr: 0.1 }), 'model-a', 'Once upon');

        expect(payload).not.toHaveProperty('mirostat');
        expect(payload).not.toHaveProperty('mirostat_tau');
        expect(payload).not.toHaveProperty('mirostat_eta');
    });
});
