const ROUTER_URL = 'http://192.168.18.101:9931';
const MODEL_PREFIX = 'Qwen3.8-27B';
const SINGLE_THOUGHT = 'PENSAMENTO-UNICO-42: a resposta deriva de contagem de dedos.';
const FIRST_THOUGHT = 'PENSAMENTO-PRIMEIRO-43: primeiro raciocinio da rodada.';
const SECOND_THOUGHT = 'PENSAMENTO-SEGUNDO-44: segundo raciocinio da rodada.';

type ApiMessage = { role: string; content: string; reasoning_content?: string; };

type ModelEntry = {
    id: string;
    status: { value: string; };
};

async function resolveLoadedQwenModelId (): Promise<string | null> {
    try {
        const response = await fetch(`${ROUTER_URL}/v1/models`);
        if (!response.ok) {
            return null;
        }
        const data = (await response.json()) as { data: ModelEntry[]; };
        const loaded = data.data.find(m => m.id.startsWith(MODEL_PREFIX) && m.status.value === 'loaded');
        return loaded ? loaded.id : null;
    } catch {
        return null;
    }
}

async function applyTemplate (model: string, messages: ApiMessage[]): Promise<string> {
    const response = await fetch(`${ROUTER_URL}/apply-template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages }),
    });
    if (!response.ok) {
        throw new Error(`apply-template failed: ${response.status} ${response.statusText}`);
    }
    const data = (await response.json()) as { prompt?: string; };
    return data.prompt ?? '';
}

const OPEN_THINK_TAG = String.fromCharCode(10, 60, 116, 104, 105, 110, 107, 62);

function countThinkTags (prompt: string): number {
    let count = 0;
    let position = prompt.indexOf(OPEN_THINK_TAG);
    while (position !== -1) {
        count += 1;
        position = prompt.indexOf(OPEN_THINK_TAG, position + OPEN_THINK_TAG.length);
    }
    return count;
}

describe('apply-template API (live router)', () => {
    let modelId: string | null = null;

    beforeAll(async () => {
        modelId = await resolveLoadedQwenModelId();
    }, 30000);

    it('should return the prompt with the thought when the model is thinking', async () => {
        if (!modelId) {
            pending('no loaded Qwen3.8-27B model on the router');
            return;
        }

        const prompt = await applyTemplate(modelId, [
            { role: 'system', content: 'You are a dungeon master.' },
            { role: 'user', content: 'Quantos dedos tem uma mao?' },
            { role: 'assistant', content: 'Cinco.', reasoning_content: SINGLE_THOUGHT },
        ]);

        expect(prompt).toContain(SINGLE_THOUGHT);
    }, 30000);

    it('should return two think tags when two thoughts are sent', async () => {
        if (!modelId) {
            pending('no loaded Qwen3.8-27B model on the router');
            return;
        }

        const prompt = await applyTemplate(modelId, [
            { role: 'system', content: 'You are a dungeon master.' },
            { role: 'user', content: 'Primeira pergunta.' },
            { role: 'assistant', content: 'Primeira resposta.', reasoning_content: FIRST_THOUGHT },
            { role: 'user', content: 'Segunda pergunta.' },
            { role: 'assistant', content: 'Segunda resposta.', reasoning_content: SECOND_THOUGHT },
        ]);

        expect(prompt).toContain(FIRST_THOUGHT);
        expect(prompt).toContain(SECOND_THOUGHT);
        expect(countThinkTags(prompt)).toBe(2);
    }, 30000);
});
