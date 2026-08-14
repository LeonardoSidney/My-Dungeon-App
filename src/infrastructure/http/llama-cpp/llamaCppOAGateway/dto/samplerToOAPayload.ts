import { Sampler } from '@domain/entities';

export type OAPayload = {
    model: string;
    prompt: string;
    stream: true;
    temperature?: number;
    top_k?: number;
};

export function mapSamplerToOAPayload (
    sampler: Sampler,
    modelId: string,
    prompt: string
): OAPayload {
    const temperature = sampler.temperature ?? 0.8;
    const topK = sampler.topK;

    const body: OAPayload = {
        model: modelId,
        prompt,
        stream: true,
        temperature,
    };

    if (topK !== undefined) {
        body.top_k = topK;
    }

    return body;
}
