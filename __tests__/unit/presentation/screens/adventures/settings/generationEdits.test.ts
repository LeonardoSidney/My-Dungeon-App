import {
    emptyGenerationEdits,
    hasGenerationEdits,
    setAssistantSampler,
    setSamplerFieldValue,
    setVoiceAssistant,
} from '@presentation/screens/adventures/settings/generationEdits';

describe('setVoiceAssistant', () => {
    it('records the assistant picked for a character', () => {
        const edits = setVoiceAssistant(emptyGenerationEdits, 'bram', 'as-2', 'as-1');

        expect(edits.voiceAssistants).toEqual({ bram: 'as-2' });
        expect(hasGenerationEdits(edits)).toBe(true);
    });

    it('drops the edit when the saved assistant is picked again', () => {
        const edited = setVoiceAssistant(emptyGenerationEdits, 'bram', 'as-2', 'as-1');

        expect(setVoiceAssistant(edited, 'bram', 'as-1', 'as-1')).toEqual(emptyGenerationEdits);
    });

    it('undoes the edit when no assistant was saved before', () => {
        const edited = setVoiceAssistant(emptyGenerationEdits, 'bram', 'as-2', undefined);

        expect(setVoiceAssistant(edited, 'bram', undefined, undefined).voiceAssistants).toEqual({});
    });
});

describe('setAssistantSampler', () => {
    it('records the sampler per assistant, so every character using it shares the edit', () => {
        const edits = setAssistantSampler(emptyGenerationEdits, 'as-1', 's-2', 's-1');

        expect(edits.assistantSamplers).toEqual({ 'as-1': 's-2' });
    });
});

describe('setSamplerFieldValue', () => {
    const saved = { temperature: '0.8', topK: '40' };

    it('starts from the saved values and keeps every other value', () => {
        const edits = setSamplerFieldValue(emptyGenerationEdits, 's-1', 'temperature', '1.2', saved);

        expect(edits.samplerValues).toEqual({ 's-1': { temperature: '1.2', topK: '40' } });
    });

    it('drops the sampler from the edits once its values match the saved ones again', () => {
        const edited = setSamplerFieldValue(emptyGenerationEdits, 's-1', 'temperature', '1.2', saved);

        expect(setSamplerFieldValue(edited, 's-1', 'temperature', '0.8', saved)).toEqual(emptyGenerationEdits);
    });

    it('clears a value when the field is emptied', () => {
        const edits = setSamplerFieldValue(emptyGenerationEdits, 's-1', 'topK', '', saved);

        expect(edits.samplerValues).toEqual({ 's-1': { temperature: '0.8' } });
    });
});
