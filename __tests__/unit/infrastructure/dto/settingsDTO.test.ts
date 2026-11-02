import { SettingsDTO } from '@infra/dto';

describe('SettingsDTO', () => {
    it('converts { systemPromptLoadOrder: "{characters}" } into { systemPromptLoadOrder: "{characters}" }', () => {
        const data = { systemPromptLoadOrder: '{characters}' };
        const expected = { systemPromptLoadOrder: '{characters}' };

        expect(SettingsDTO.fromStorage(data)?.toEntity()).toEqual(expected);
    });

    it('converts { systemPromptLoadOrder: "" } into { systemPromptLoadOrder: "" }', () => {
        const data = { systemPromptLoadOrder: '' };
        const expected = { systemPromptLoadOrder: '' };

        expect(SettingsDTO.fromStorage(data)?.toEntity()).toEqual(expected);
    });

    it('converts {} into {}', () => {
        const data = {};
        const expected = {};

        expect(SettingsDTO.fromStorage(data)?.toEntity()).toEqual(expected);
    });

    it('converts { systemPromptLoadOrder: undefined } into {}', () => {
        const data = { systemPromptLoadOrder: undefined };
        const expected = {};

        expect(SettingsDTO.fromStorage(data)?.toEntity()).toEqual(expected);
    });

    it('omits the load order key when none was stored', () => {
        const settings = SettingsDTO.fromStorage({})?.toEntity();

        expect(settings && Object.keys(settings)).toEqual([]);
    });

    it('rejects null', () => {
        expect(SettingsDTO.fromStorage(null)).toBeNull();
    });

    it('rejects undefined', () => {
        expect(SettingsDTO.fromStorage(undefined)).toBeNull();
    });

    it('rejects settings', () => {
        expect(SettingsDTO.fromStorage('settings')).toBeNull();
    });

    it('rejects 42', () => {
        expect(SettingsDTO.fromStorage(42)).toBeNull();
    });

    it('rejects []', () => {
        const data: unknown[] = [];

        expect(SettingsDTO.fromStorage(data)).toBeNull();
    });

    it('rejects { systemPromptLoadOrder: 42 }', () => {
        const data = { systemPromptLoadOrder: 42 };

        expect(SettingsDTO.fromStorage(data)).toBeNull();
    });

    it('rejects { systemPromptLoadOrder: null }', () => {
        const data = { systemPromptLoadOrder: null };

        expect(SettingsDTO.fromStorage(data)).toBeNull();
    });

    it('rejects { systemPromptLoadOrder: ["{characters}"] }', () => {
        const data = { systemPromptLoadOrder: ['{characters}'] };

        expect(SettingsDTO.fromStorage(data)).toBeNull();
    });

    it('converts a stored think blocks visibility', () => {
        expect(SettingsDTO.fromStorage({ showThinkBlocks: false })?.toEntity()).toEqual({ showThinkBlocks: false });
    });

    it('keeps the load order next to the think blocks visibility', () => {
        const settings = SettingsDTO.fromStorage({ systemPromptLoadOrder: '{characters}', showThinkBlocks: true })?.toEntity();

        expect(settings).toEqual({ systemPromptLoadOrder: '{characters}', showThinkBlocks: true });
    });

    it('rejects a think blocks visibility that is not a boolean', () => {
        expect(SettingsDTO.fromStorage({ showThinkBlocks: 'false' })).toBeNull();
    });

    it('converts a stored scene context setting', () => {
        expect(SettingsDTO.fromStorage({ sceneContextEnabled: false })?.toEntity()).toEqual({ sceneContextEnabled: false });
    });

    it('keeps the chat templates next to the scene context setting', () => {
        const settings = SettingsDTO.fromStorage({ sceneContextEnabled: false, chatTemplates: { worlds: '{worlds}' } })?.toEntity();

        expect(settings).toEqual({ sceneContextEnabled: false, chatTemplates: { worlds: '{worlds}' } });
    });

    it('rejects a scene context setting that is not a boolean', () => {
        expect(SettingsDTO.fromStorage({ sceneContextEnabled: 'false' })).toBeNull();
    });

    it('converts the stored chat templates', () => {
        const settings = SettingsDTO.fromStorage({ chatTemplates: { worlds: '# REALMS\n{worlds}\n' } })?.toEntity();

        expect(settings).toEqual({ chatTemplates: { worlds: '# REALMS\n{worlds}\n' } });
    });

    it('drops the stored chat templates that are no longer known', () => {
        const settings = SettingsDTO.fromStorage({ chatTemplates: { worlds: '{worlds}', retired: 'text' } })?.toEntity();

        expect(settings).toEqual({ chatTemplates: { worlds: '{worlds}' } });
    });

    it('rejects chat templates that are not an object', () => {
        expect(SettingsDTO.fromStorage({ chatTemplates: ['{worlds}'] })).toBeNull();
    });

    it('rejects chat templates with a value that is not text', () => {
        expect(SettingsDTO.fromStorage({ chatTemplates: { worlds: 42 } })).toBeNull();
    });
});
