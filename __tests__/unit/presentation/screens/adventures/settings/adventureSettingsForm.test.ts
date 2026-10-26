import { MirostatEnum } from '@domain/entities';
import {
    NarratorModeEnum,
    VoiceRoleEnum,
    VoiceSourceEnum,
    getGenerationVoices,
    getModifiedSections,
    getPlayerVoices,
    switchNarratorMode,
    toAdventureSettingsForm,
    toApplySettingsRequest,
    validateAdventureSettings,
    type AdventureSettingsForm,
} from '@presentation/screens/adventures/settings/adventureSettingsForm';
import { emptyGenerationEdits } from '@presentation/screens/adventures/settings/generationEdits';

const options = {
    characters: [{ id: 'char-1', name: 'Aria' }, { id: 'char-2', name: 'Bram' }],
    systemPrompts: [{ id: 'sp-1', name: 'Base' }],
    worldMasters: [{ id: 'wm-1', name: 'Luna' }],
    worlds: [{ id: 'world-1', name: 'Eldoria' }],
    locations: [],
    items: [],
};

const adventure = {
    id: 'adventure-1',
    name: 'The Lost Kingdom',
    systemPromptIds: ['sp-1'],
    playableCharacterIds: ['char-1'],
    aiControlledCharacterIds: ['char-2'],
    worldMasterId: 'wm-1',
    worldIds: ['world-1'],
    locationIds: [],
    itemIds: [],
};

function buildForm (): AdventureSettingsForm {
    return toAdventureSettingsForm(adventure, options);
}

describe('toAdventureSettingsForm', () => {
    it('maps the adventure and starts with no generation edits', () => {
        const form = buildForm();

        expect(form.narratorMode).toBe(NarratorModeEnum.WORLD_MASTER);
        expect(form.adventure.worldMaster).toEqual({ id: 'wm-1', name: 'Luna' });
        expect(form.adventure.characters).toEqual([{ id: 'char-1', name: 'Aria' }]);
        expect(form.generation).toEqual(emptyGenerationEdits);
    });

    it('starts in character mode when a character narrates', () => {
        const form = toAdventureSettingsForm(
            { ...adventure, worldMasterId: undefined, characterAsWorldMasterId: 'char-2', aiControlledCharacterIds: [] },
            options,
        );

        expect(form.narratorMode).toBe(NarratorModeEnum.CHARACTER);
    });
});

describe('switchNarratorMode', () => {
    it('clears the world master when switching to a narrating character', () => {
        const form = switchNarratorMode(buildForm(), NarratorModeEnum.CHARACTER);

        expect(form.narratorMode).toBe(NarratorModeEnum.CHARACTER);
        expect(form.adventure.worldMaster).toBeUndefined();
    });

    it('clears the narrating character when switching back to a world master', () => {
        const base = buildForm();
        const narratedByCharacter = { ...base, narratorMode: NarratorModeEnum.CHARACTER, adventure: { ...base.adventure, worldMaster: undefined, characterAsWorldMasterId: 'char-2' } };

        const form = switchNarratorMode(narratedByCharacter, NarratorModeEnum.WORLD_MASTER);

        expect(form.adventure.characterAsWorldMasterId).toBeUndefined();
    });

    it('keeps the form untouched when the mode does not change', () => {
        const base = buildForm();

        expect(switchNarratorMode(base, NarratorModeEnum.WORLD_MASTER)).toBe(base);
    });
});

describe('validateAdventureSettings', () => {
    it('accepts a complete form', () => {
        expect(validateAdventureSettings(buildForm())).toEqual({});
    });

    it('reports every missing required choice', () => {
        const base = buildForm();
        const form: AdventureSettingsForm = {
            ...base,
            adventure: { ...base.adventure, name: ' ', characters: [], systemPrompts: [], worldMaster: undefined },
        };

        expect(Object.keys(validateAdventureSettings(form)).sort()).toEqual(['cast', 'name', 'narrator', 'systemPrompts']);
    });

    it('reports the invalid values of each edited sampler', () => {
        const base = buildForm();
        const form = { ...base, generation: { ...emptyGenerationEdits, samplerValues: { 's-1': { temperature: '0.7', topK: 'abc' } } } };

        expect(validateAdventureSettings(form)).toEqual({ samplers: { 's-1': { topK: 'Must be a whole number' } } });
    });
});

describe('getGenerationVoices', () => {
    it('lists the narrator first and then every AI controlled character', () => {
        expect(getGenerationVoices(buildForm().adventure, options.characters)).toEqual([
            { id: 'wm-1', name: 'Luna', role: VoiceRoleEnum.NARRATOR, source: VoiceSourceEnum.WORLD_MASTER },
            { id: 'char-2', name: 'Bram', role: VoiceRoleEnum.AI, source: VoiceSourceEnum.CHARACTER },
        ]);
    });

    it('reads the narrating character from the characters', () => {
        const base = buildForm();
        const adventureForm = { ...base.adventure, worldMaster: undefined, characterAsWorldMasterId: 'char-2', charactersControlledByAi: [] };

        expect(getGenerationVoices(adventureForm, options.characters)).toEqual([
            { id: 'char-2', name: 'Bram', role: VoiceRoleEnum.NARRATOR, source: VoiceSourceEnum.CHARACTER },
        ]);
    });
});

describe('getPlayerVoices', () => {
    it('lists the characters the player controls', () => {
        expect(getPlayerVoices(buildForm().adventure.characters)).toEqual([
            { id: 'char-1', name: 'Aria', role: VoiceRoleEnum.PLAYER, source: VoiceSourceEnum.CHARACTER },
        ]);
    });
});

describe('toApplySettingsRequest', () => {
    it('splits the assistant edits by entity and sends the complete values of each edited sampler', () => {
        const base = buildForm();
        const form = {
            ...base,
            generation: {
                voiceAssistants: { 'wm-1': 'as-3', 'char-2': 'as-2', 'char-1': 'as-4', gone: 'as-9' },
                assistantSamplers: { 'as-2': 's-2' },
                samplerValues: { 's-2': { topK: '40', mirostat: '2', ignoreEOS: 'false' } },
            },
        };

        const request = toApplySettingsRequest(form);

        expect(request.adventureId).toBe('adventure-1');
        expect(request.adventure).toEqual(expect.objectContaining({ name: 'The Lost Kingdom', worldMasterId: 'wm-1' }));
        expect(request.worldMasterAssistants).toEqual({ 'wm-1': 'as-3' });
        expect(request.characterAssistants).toEqual({ 'char-2': 'as-2', 'char-1': 'as-4' });
        expect(request.assistantSamplers).toEqual({ 'as-2': 's-2' });
        expect(request.samplerParameters['s-2']).toEqual(expect.objectContaining({
            topK: 40,
            mirostat: MirostatEnum.MIROSTAT2,
            ignoreEOS: false,
            temperature: undefined,
        }));
        expect(Object.keys(request.samplerParameters['s-2'])).toContain('temperature');
    });
});

describe('getModifiedSections', () => {
    it('flags only the sections whose values changed', () => {
        const saved = buildForm();
        const draft = { ...saved, adventure: { ...saved.adventure, worlds: [] } };

        expect(getModifiedSections(saved, draft)).toEqual({
            general: false,
            narrator: false,
            cast: false,
            context: true,
        });
    });
});
