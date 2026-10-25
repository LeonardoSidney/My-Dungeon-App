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
});
