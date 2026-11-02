import { mapSamplerToNativePayload } from '@infra/http/llama-cpp/llamaCppNativeGateway/dto/samplerToNativePayload';
import { MirostatEnum, SamplerParameters } from '@domain/entities';
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
            dryAllowedLength: 2,
            drySequenceBreakers: '\n":*',
            xtcProbability: 0.5,
            xtcThreshold: 0.1,
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

    it('maps the dynamic temperature range', () => {
        const body = mapSamplerToNativePayload(createSamplerHelper({ dynaTempRange: 0.5 }), 'model-a', 'Once upon');

        expect(body.dynatemp_range).toBe(0.5);
    });

    it('maps the dynamic temperature exponent', () => {
        const body = mapSamplerToNativePayload(createSamplerHelper({ dynaTempExp: 1.5 }), 'model-a', 'Once upon');

        expect(body.dynatemp_exponent).toBe(1.5);
    });

    it('maps the top n sigma', () => {
        const body = mapSamplerToNativePayload(createSamplerHelper({ topNSigma: 2 }), 'model-a', 'Once upon');

        expect(body.top_n_sigma).toBe(2);
    });

    it('maps the adaptive decay', () => {
        const body = mapSamplerToNativePayload(createSamplerHelper({ adaptiveDecay: 0.9 }), 'model-a', 'Once upon');

        expect(body.adaptive_decay).toBe(0.9);
    });

    it('sends zero values instead of dropping them', () => {
        const body = mapSamplerToNativePayload(createSamplerHelper({ dynaTempRange: 0, topNSigma: 0 }), 'model-a', 'Once upon');

        expect(body.dynatemp_range).toBe(0);
        expect(body.top_n_sigma).toBe(0);
    });

    it('adds the adaptive sampler to the end of the default chain when there is a target', () => {
        const body = mapSamplerToNativePayload(createSamplerHelper({ adaptiveTarget: 0.5 }), 'model-a', 'Once upon');

        expect(body.adaptive_target).toBe(0.5);
        expect(body.samplers).toEqual([
            'penalties',
            'dry',
            'top_n_sigma',
            'top_k',
            'typ_p',
            'top_p',
            'min_p',
            'xtc',
            'temperature',
            'adaptive_p'
        ]);
    });

    it('keeps the default sampler chain of the server without a target', () => {
        const body = mapSamplerToNativePayload(createSamplerHelper({ adaptiveDecay: 0.9 }), 'model-a', 'Once upon');

        expect(body).not.toHaveProperty('samplers');
    });

    it('does not let one payload change the chain of the next one', () => {
        const first = mapSamplerToNativePayload(createSamplerHelper({ adaptiveTarget: 0.5 }), 'model-a', 'Once upon');
        first.samplers?.push('changed');

        const second = mapSamplerToNativePayload(createSamplerHelper({ adaptiveTarget: 0.5 }), 'model-a', 'Once upon');

        expect(second.samplers).not.toContain('changed');
    });

    it('sends a value for every sampler parameter', () => {
        const parameters: Required<SamplerParameters> = {
            adaptiveDecay: 0.9,
            adaptiveTarget: 0.5,
            dryAllowedLength: 2,
            dryBase: 1.75,
            dryMultiplier: 0.8,
            drySequenceBreakers: '\n',
            dynaTempExp: 1.5,
            dynaTempRange: 0.5,
            ignoreEOS: true,
            minP: 0.1,
            mirostat: MirostatEnum.MIROSTAT1,
            mirostatEnt: 5,
            mirostatLr: 0.1,
            frequencyPenalty: 0.3,
            presencePenalty: 0.2,
            repeatLastN: 64,
            repeatPenalty: 1.1,
            seed: '42',
            temperature: 0.7,
            topK: 50,
            topNSigma: 2,
            topP: 0.9,
            typicalP: 0.8,
            xtcProbability: 0.5,
            xtcThreshold: 0.1
        };

        const body = mapSamplerToNativePayload(createSamplerHelper(parameters), 'model-a', 'Once upon');

        expect(body).toEqual(expect.objectContaining({
            adaptive_decay: 0.9,
            adaptive_target: 0.5,
            dry_allowed_length: 2,
            dry_base: 1.75,
            dry_multiplier: 0.8,
            dry_sequence_breakers: ['\n'],
            dynatemp_exponent: 1.5,
            dynatemp_range: 0.5,
            ignore_eos: true,
            min_p: 0.1,
            mirostat: MirostatEnum.MIROSTAT1,
            mirostat_tau: 5,
            mirostat_eta: 0.1,
            frequency_penalty: 0.3,
            presence_penalty: 0.2,
            repeat_last_n: 64,
            repeat_penalty: 1.1,
            seed: 42,
            temperature: 0.7,
            top_k: 50,
            top_n_sigma: 2,
            top_p: 0.9,
            typical_p: 0.8,
            xtc_probability: 0.5,
            xtc_threshold: 0.1
        }));
    });
});
