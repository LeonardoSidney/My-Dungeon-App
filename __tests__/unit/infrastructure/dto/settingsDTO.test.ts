import { SettingsDTO } from '@infra/dto';

describe('SettingsDTO', () => {
    it.each([
        [{ systemPromptLoadOrder: '{characters}' }, { systemPromptLoadOrder: '{characters}' }],
        [{ systemPromptLoadOrder: '' }, { systemPromptLoadOrder: '' }],
        [{}, {}],
        [{ systemPromptLoadOrder: undefined }, {}],
    ])('converts %j into %j', (data, expected) => {
        expect(SettingsDTO.fromStorage(data)?.toEntity()).toEqual(expected);
    });

    it('omits the load order key when none was stored', () => {
        const settings = SettingsDTO.fromStorage({})?.toEntity();

        expect(settings && Object.keys(settings)).toEqual([]);
    });

    it.each([
        null,
        undefined,
        'settings',
        42,
        [],
        { systemPromptLoadOrder: 42 },
        { systemPromptLoadOrder: null },
        { systemPromptLoadOrder: ['{characters}'] },
    ])('rejects %j', (data) => {
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
