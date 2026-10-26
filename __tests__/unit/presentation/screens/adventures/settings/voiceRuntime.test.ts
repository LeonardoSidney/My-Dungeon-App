import { VoiceRoleEnum, VoiceSourceEnum } from '@presentation/screens/adventures/settings/adventureSettingsForm';
import { emptyGenerationEdits } from '@presentation/screens/adventures/settings/generationEdits';
import {
    findVoiceSharing,
    isVoiceEdited,
    resolveVoiceRuntime,
    type GenerationCatalog,
} from '@presentation/screens/adventures/settings/voiceRuntime';

const catalog: GenerationCatalog = {
    assistants: [
        { id: 'as-1', name: 'Qwen Local', modelId: 'qwen3', samplerId: 's-1', connectionId: 'c-1' },
        { id: 'as-2', name: 'Llama Cloud', modelId: 'llama4', samplerId: 's-2', connectionId: 'c-2' },
    ],
    samplers: [
        { id: 's-1', name: 'Balanced', systemDefault: false, temperature: 0.8 },
        { id: 's-2', name: 'Creative', systemDefault: false, temperature: 1.2 },
    ],
    connections: [
        { id: 'c-1', name: 'Home PC', ip: '192.168.0.2' },
        { id: 'c-2', name: 'Cloud', ip: 'api.example.com' },
    ],
    profileAssistantIds: { bram: 'as-1', luna: 'as-1', aria: 'as-2' },
};

const voices = [
    { id: 'luna', name: 'Luna', role: VoiceRoleEnum.NARRATOR, source: VoiceSourceEnum.WORLD_MASTER },
    { id: 'bram', name: 'Bram', role: VoiceRoleEnum.AI, source: VoiceSourceEnum.CHARACTER },
    { id: 'aria', name: 'Aria', role: VoiceRoleEnum.PLAYER, source: VoiceSourceEnum.CHARACTER },
];

describe('resolveVoiceRuntime', () => {
    it('follows the profile assistant, its sampler and the saved values when nothing is edited', () => {
        const runtime = resolveVoiceRuntime('bram', emptyGenerationEdits, catalog);

        expect(runtime.assistant?.name).toBe('Qwen Local');
        expect(runtime.sampler?.name).toBe('Balanced');
        expect(runtime.connection?.name).toBe('Home PC');
        expect(runtime.samplerValues).toEqual({ temperature: '0.8' });
        expect(isVoiceEdited(runtime)).toBe(false);
    });

    it('uses the sampler of the newly picked assistant', () => {
        const runtime = resolveVoiceRuntime('bram', { ...emptyGenerationEdits, voiceAssistants: { bram: 'as-2' } }, catalog);

        expect(runtime.savedAssistant?.name).toBe('Qwen Local');
        expect(runtime.assistant?.name).toBe('Llama Cloud');
        expect(runtime.sampler?.name).toBe('Creative');
        expect(runtime.isAssistantEdited).toBe(true);
    });

    it('shows an assistant sampler edit to every character using that assistant', () => {
        const edits = { ...emptyGenerationEdits, assistantSamplers: { 'as-1': 's-2' } };

        expect(resolveVoiceRuntime('bram', edits, catalog).sampler?.name).toBe('Creative');
        expect(resolveVoiceRuntime('luna', edits, catalog).sampler?.name).toBe('Creative');
        expect(resolveVoiceRuntime('aria', edits, catalog).isSamplerEdited).toBe(false);
    });

    it('reads the edited values of the sampler instead of the saved ones', () => {
        const edits = { ...emptyGenerationEdits, samplerValues: { 's-1': { temperature: '1.5' } } };

        const runtime = resolveVoiceRuntime('bram', edits, catalog);

        expect(runtime.samplerValues).toEqual({ temperature: '1.5' });
        expect(runtime.savedSamplerValues).toEqual({ temperature: '0.8' });
        expect(runtime.areValuesEdited).toBe(true);
    });
});

describe('findVoiceSharing', () => {
    it('names the other voices that share the assistant and the sampler', () => {
        expect(findVoiceSharing(voices[1], voices, emptyGenerationEdits, catalog)).toEqual({ assistant: ['Luna'], sampler: ['Luna'] });
        expect(findVoiceSharing(voices[2], voices, emptyGenerationEdits, catalog)).toEqual({ assistant: [], sampler: [] });
    });
});
