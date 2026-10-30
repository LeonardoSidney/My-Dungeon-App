import { act, renderHook } from '@testing-library/react-native';
import { ChatTemplateKeyEnum } from '@domain/entities';
import { ChatTemplateField } from '@presentation/screens/settings/chatTemplatesForm';
import { useChatTemplates } from '@presentation/screens/settings/useChatTemplates';

const FIELDS: ChatTemplateField[] = [
    { key: ChatTemplateKeyEnum.WORLDS, label: 'Worlds' },
    { key: ChatTemplateKeyEnum.ITEMS, label: 'Items' },
];

const TEMPLATES = { worlds: '# REALMS\n{worlds}', items: '{items}', locations: '{locations}' };
const DEFINITIONS = { worlds: { defaultTemplate: '# WORLDS\n{worlds}\n', requiredTags: ['worlds'], optionalTags: [] } };

function buildParams (overrides: Partial<Parameters<typeof useChatTemplates>[0]> = {}) {
    return {
        fields: FIELDS,
        getChatTemplates: { handle: jest.fn().mockResolvedValue({ success: true, templates: TEMPLATES, definitions: DEFINITIONS }) },
        saveChatTemplates: { handle: jest.fn().mockResolvedValue({ success: true }) },
        alert: { handle: jest.fn() },
        ...overrides,
    } as unknown as Parameters<typeof useChatTemplates>[0];
}

async function renderLoaded (params = buildParams()) {
    const rendered = await renderHook(() => useChatTemplates(params));
    await act(async () => {});
    return rendered;
}

describe('useChatTemplates', () => {
    it('loads only the templates of its fields', async () => {
        const { result } = await renderLoaded();

        expect(result.current.isLoading).toBe(false);
        expect(result.current.templates).toEqual({ worlds: '# REALMS\n{worlds}', items: '{items}' });
        expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('reports the load error', async () => {
        const params = buildParams({
            getChatTemplates: { handle: jest.fn().mockResolvedValue({ success: false, error: 'Storage failure' }) },
        });

        const { result } = await renderLoaded(params);

        expect(result.current.loadError).toBe('Storage failure');
    });

    it('uses a default load error when the answer has no templates', async () => {
        const params = buildParams({ getChatTemplates: { handle: jest.fn().mockResolvedValue({ success: true }) } });

        const { result } = await renderLoaded(params);

        expect(result.current.loadError).toBe('Failed to load the chat templates');
    });

    it('marks an edited template as unsaved', async () => {
        const { result } = await renderLoaded();

        await act(async () => {
            result.current.changeTemplate(ChatTemplateKeyEnum.WORLDS, '{worlds}');
        });

        expect(result.current.templates.worlds).toBe('{worlds}');
        expect(result.current.hasUnsavedChanges).toBe(true);
    });

    it('restores the default text only in the draft', async () => {
        const params = buildParams();
        const { result } = await renderLoaded(params);

        await act(async () => {
            result.current.restoreDefault(ChatTemplateKeyEnum.WORLDS);
        });

        expect(result.current.templates.worlds).toBe('# WORLDS\n{worlds}\n');
        expect(result.current.hasUnsavedChanges).toBe(true);
        expect(params.saveChatTemplates.handle).not.toHaveBeenCalled();
    });

    it('saves the drafts of its fields and clears the unsaved state', async () => {
        const params = buildParams();
        const { result } = await renderLoaded(params);

        await act(async () => {
            result.current.changeTemplate(ChatTemplateKeyEnum.ITEMS, '# GEAR\n{items}');
        });
        await act(async () => {
            await result.current.save();
        });

        expect(params.saveChatTemplates.handle).toHaveBeenCalledWith({ templates: { worlds: '# REALMS\n{worlds}', items: '# GEAR\n{items}' } });
        expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it('shows the field errors and keeps the draft unsaved', async () => {
        const params = buildParams({
            saveChatTemplates: {
                handle: jest.fn().mockResolvedValue({ success: false, fieldErrors: { worlds: 'Missing tag: {worlds}' } }),
            },
        });
        const { result } = await renderLoaded(params);

        await act(async () => {
            result.current.changeTemplate(ChatTemplateKeyEnum.WORLDS, 'text');
        });
        await act(async () => {
            await result.current.save();
        });

        expect(result.current.errors.worlds).toBe('Missing tag: {worlds}');
        expect(result.current.hasUnsavedChanges).toBe(true);
        expect(params.alert.handle).not.toHaveBeenCalled();
    });

    it('clears the error of a field when it changes', async () => {
        const params = buildParams({
            saveChatTemplates: {
                handle: jest.fn().mockResolvedValue({ success: false, fieldErrors: { worlds: 'Missing tag: {worlds}' } }),
            },
        });
        const { result } = await renderLoaded(params);

        await act(async () => {
            await result.current.save();
        });
        await act(async () => {
            result.current.changeTemplate(ChatTemplateKeyEnum.WORLDS, '{worlds}');
        });

        expect(result.current.errors.worlds).toBeUndefined();
    });

    it('alerts when the save fails without field errors', async () => {
        const params = buildParams({
            saveChatTemplates: { handle: jest.fn().mockResolvedValue({ success: false, error: 'Failed to save settings' }) },
        });
        const { result } = await renderLoaded(params);

        await act(async () => {
            result.current.changeTemplate(ChatTemplateKeyEnum.WORLDS, '{worlds}');
        });
        await act(async () => {
            await result.current.save();
        });

        expect(params.alert.handle).toHaveBeenCalled();
        expect(result.current.hasUnsavedChanges).toBe(true);
    });
});
