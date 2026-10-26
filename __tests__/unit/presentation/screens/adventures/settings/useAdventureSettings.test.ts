import { act, renderHook } from '@testing-library/react-native';
import { NarratorModeEnum } from '@presentation/screens/adventures/settings/adventureSettingsForm';
import { useAdventureSettings } from '@presentation/screens/adventures/settings/hooks/useAdventureSettings';

type HookParams = Parameters<typeof useAdventureSettings>[0];

const adventure = {
    id: 'adventure-1',
    name: 'The Lost Kingdom',
    systemPromptIds: ['sp-1'],
    playableCharacterIds: ['char-1'],
    aiControlledCharacterIds: [],
    worldMasterId: 'wm-1',
    worldIds: [],
    locationIds: [],
    itemIds: [],
};

function buildOptions (overrides: Partial<HookParams['options']> = {}): HookParams['options'] {
    return {
        characters: [{ id: 'char-1', name: 'Aria' }],
        systemPrompts: [{ id: 'sp-1', name: 'Base' }],
        worldMasters: [{ id: 'wm-1', name: 'Luna' }],
        worlds: [],
        locations: [],
        items: [],
        errors: {},
        isLoading: false,
        ...overrides,
    };
}

function buildControllers (overrides: Partial<HookParams['controllers']> = {}) {
    return {
        getAdventure: { handle: jest.fn().mockResolvedValue({ success: true, data: adventure }) },
        applyAdventureSettings: { handle: jest.fn().mockResolvedValue({ success: true }) },
        alert: { handle: jest.fn() },
        ...overrides,
    };
}

async function renderLoaded (controllers = buildControllers(), options = buildOptions()) {
    const rendered = await renderHook(() => useAdventureSettings({ adventureId: 'adventure-1', options, controllers }));
    await act(async () => {});
    return rendered;
}

describe('useAdventureSettings', () => {
    it('loads the adventure into a draft with nothing to apply', async () => {
        const { result } = await renderLoaded();

        expect(result.current.draft?.adventure.name).toBe('The Lost Kingdom');
        expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('waits for the option lists before building the draft', async () => {
        const { result } = await renderLoaded(buildControllers(), buildOptions({ isLoading: true }));

        expect(result.current.draft).toBeNull();
    });

    it('refuses to build the draft when an option list failed to load', async () => {
        const { result } = await renderLoaded(buildControllers(), buildOptions({ errors: { characters: 'Failed to load characters.' } }));

        expect(result.current.draft).toBeNull();
        expect(result.current.loadError).toBe('Failed to load the adventure options.');
    });

    it('shows the load error when the adventure cannot be loaded', async () => {
        const controllers = buildControllers({ getAdventure: { handle: jest.fn().mockResolvedValue({ success: false, error: 'Adventure not found' }) } });

        const { result } = await renderLoaded(controllers);

        expect(result.current.loadError).toBe('Adventure not found');
    });

    it('applies the edited adventure and clears the unsaved state', async () => {
        const controllers = buildControllers();
        const { result } = await renderLoaded(controllers);

        await act(async () => { result.current.changeAdventure({ name: 'The Found Kingdom' }); });
        expect(result.current.hasUnsavedChanges).toBe(true);
        expect(result.current.modifiedSections?.general).toBe(true);

        await act(async () => { await result.current.apply(); });

        expect(controllers.applyAdventureSettings.handle).toHaveBeenCalledWith({
            adventureId: 'adventure-1',
            adventure: expect.objectContaining({ name: 'The Found Kingdom', worldMasterId: 'wm-1' }),
            characterAssistants: {},
            worldMasterAssistants: {},
            assistantSamplers: {},
            samplerParameters: {},
        });
        expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('keeps the changes and alerts when applying fails', async () => {
        const controllers = buildControllers({ applyAdventureSettings: { handle: jest.fn().mockResolvedValue({ success: false, error: 'A system prompt is required' }) } });
        const { result } = await renderLoaded(controllers);

        await act(async () => { result.current.changeAdventure({ name: 'Renamed' }); });
        await act(async () => { await result.current.apply(); });

        expect(controllers.alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'A system prompt is required' });
        expect(result.current.hasUnsavedChanges).toBe(true);
    });

    it('does not apply while the draft has validation errors', async () => {
        const controllers = buildControllers();
        const { result } = await renderLoaded(controllers);

        await act(async () => { result.current.changeSamplerValue('s-1', 'temperature', 'hot', { temperature: '0.8' }); });
        await act(async () => { await result.current.apply(); });

        expect(result.current.hasErrors).toBe(true);
        expect(controllers.applyAdventureSettings.handle).not.toHaveBeenCalled();
    });

    it('counts generation edits as unsaved changes', async () => {
        const { result } = await renderLoaded();

        await act(async () => { result.current.changeVoiceAssistant('wm-1', 'as-2', 'as-1'); });

        expect(result.current.hasUnsavedChanges).toBe(true);
        expect(result.current.draft?.generation.voiceAssistants).toEqual({ 'wm-1': 'as-2' });
    });

    it('sends the generation edits to the entities and clears them once applied', async () => {
        const controllers = buildControllers();
        const { result } = await renderLoaded(controllers);

        await act(async () => { result.current.changeVoiceAssistant('wm-1', 'as-2', 'as-1'); });
        await act(async () => { result.current.changeAssistantSampler('as-2', 's-3', 's-2'); });
        await act(async () => { result.current.changeSamplerValue('s-3', 'temperature', '1.2', { temperature: '0.8' }); });
        await act(async () => { await result.current.apply(); });

        expect(controllers.applyAdventureSettings.handle).toHaveBeenCalledWith(expect.objectContaining({
            worldMasterAssistants: { 'wm-1': 'as-2' },
            assistantSamplers: { 'as-2': 's-3' },
            samplerParameters: { 's-3': expect.objectContaining({ temperature: 1.2 }) },
        }));
        expect(result.current.hasUnsavedChanges).toBe(false);
        expect(result.current.draft?.generation.voiceAssistants).toEqual({});
    });

    it('discards the draft back to the applied values', async () => {
        const { result } = await renderLoaded();

        await act(async () => { result.current.changeNarratorMode(NarratorModeEnum.CHARACTER); });
        expect(result.current.errors.narrator).toBeDefined();

        await act(async () => { result.current.discard(); });

        expect(result.current.draft?.narratorMode).toBe(NarratorModeEnum.WORLD_MASTER);
        expect(result.current.hasUnsavedChanges).toBe(false);
    });
});
