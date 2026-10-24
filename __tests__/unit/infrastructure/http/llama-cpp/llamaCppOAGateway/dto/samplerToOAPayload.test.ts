import { mapSamplerToOAPayload } from '@infra/http/llama-cpp/llamaCppOAGateway/dto/samplerToOAPayload';
import { createSamplerHelper } from '@test/helpers';

describe('mapSamplerToOAPayload', () => {
    it('sends the model, the prompt and the sampler temperature and top k', () => {
        expect(mapSamplerToOAPayload(createSamplerHelper({ temperature: 0.5, topK: 20 }), 'model-a', 'Once upon')).toEqual({
            model: 'model-a',
            prompt: 'Once upon',
            stream: true,
            temperature: 0.5,
            top_k: 20
        });
    });

    it('falls back to the default temperature and omits top k when the sampler has none', () => {
        expect(mapSamplerToOAPayload(createSamplerHelper(), 'model-a', 'Once upon')).toEqual({
            model: 'model-a',
            prompt: 'Once upon',
            stream: true,
            temperature: 0.8
        });
    });
});
