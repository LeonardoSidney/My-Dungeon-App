import * as React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useEntityScreen, type EntityFormErrors, type UseEntityScreenParams } from '@presentation/hooks';
import { createTestNavigation, TestNavigationProvider } from '@test/helpers';

type TestEntity = {
    id: string;
    name: string;
    activationWord: string;
};

type TestForm = {
    id: string;
    name: string;
    activationWord: string;
};

type TestDetails = TestEntity & {
    prompt: string;
};

const LOADED = { success: true, items: [{ id: '1', name: 'A', activationWord: 'w' }] };
const DETAILS: TestDetails = { id: '1', name: 'A', activationWord: 'w', prompt: 'p' };
const alert = { handle: jest.fn() };
let load: jest.Mock;

function buildParams (fetch: jest.Mock, submit?: jest.Mock, erase?: jest.Mock): UseEntityScreenParams<TestEntity, TestForm, TestDetails> {
    return {
        fetch,
        load,
        submit: submit ?? jest.fn().mockResolvedValue({ success: true }),
        erase: erase ?? jest.fn().mockResolvedValue({ success: true }),
        toFormState: (details) => ({ id: details.id, name: details.name, activationWord: details.activationWord }),
        initialForm: () => ({ id: '', name: '', activationWord: '' }),
        validate: (form) => {
            const errors: EntityFormErrors<TestForm> = {};
            if (!form.name) {
                errors.name = 'Name is required';
            }
            return errors;
        },
        entityName: 'thing',
        alert,
    };
}

async function renderLoaded (fetch: jest.Mock, submit?: jest.Mock, erase?: jest.Mock) {
    const params = buildParams(fetch, submit, erase);
    const navigation = createTestNavigation();
    const view = await renderHook(
        () => useEntityScreen<TestEntity, TestForm, TestDetails>(params),
        { wrapper: (props) => React.createElement(TestNavigationProvider, { navigation: navigation.navigation }, props.children) }
    );
    await waitFor(() => expect(view.result.current.isLoading).toBe(false));
    return view;
}

describe('useEntityScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        load = jest.fn().mockResolvedValue({ success: true, data: DETAILS });
    });

    it('loads entities on mount and clears the loading flag', async () => {
        const fetch = jest.fn().mockResolvedValue(LOADED);
        const { result } = await renderLoaded(fetch);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result.current.entities).toHaveLength(1);
        expect(result.current.isError).toBe(false);
    });

    it('marks the list as errored when fetch fails and recovers on reload', async () => {
        const fetch = jest.fn()
            .mockResolvedValueOnce({ success: false, error: 'boom' })
            .mockResolvedValue(LOADED);
        const { result } = await renderLoaded(fetch);

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.entities).toHaveLength(0);

        await act(async () => {
            await result.current.reload();
        });
        await waitFor(() => expect(result.current.isError).toBe(false));
        expect(result.current.entities).toHaveLength(1);
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('does not submit when validation fails and surfaces the field errors', async () => {
        const submit = jest.fn().mockResolvedValue({ success: true });
        const { result } = await renderLoaded(jest.fn().mockResolvedValue(LOADED), submit);

        await act(async () => {
            await result.current.save();
        });

        expect(submit).not.toHaveBeenCalled();
        expect(result.current.formErrors).toEqual({ name: 'Name is required' });
    });

    it('clears a field error when that field is edited', async () => {
        const { result } = await renderLoaded(jest.fn().mockResolvedValue(LOADED));

        await act(async () => {
            await result.current.save();
        });
        expect(result.current.formErrors).toEqual({ name: 'Name is required' });

        await act(async () => {
            result.current.updateField('name', 'Valid');
        });
        expect(result.current.formErrors).toEqual({});
    });

    it('resets the form and reloads the list on a successful save', async () => {
        const fetch = jest.fn().mockResolvedValue(LOADED);
        const submit = jest.fn().mockResolvedValue({ success: true });
        const initialForm = { id: '', name: '', activationWord: '' };
        const { result } = await renderLoaded(fetch, submit);

        await act(async () => {
            result.current.openAdd();
        });
        expect(result.current.showForm).toBe(true);

        await act(async () => {
            result.current.updateField('name', 'Valid');
        });
        const fetchCallsBefore = fetch.mock.calls.length;

        await act(async () => {
            await result.current.save();
        });

        expect(submit).toHaveBeenCalledTimes(1);
        expect(result.current.form).toEqual(initialForm);
        expect(result.current.showForm).toBe(false);
        await waitFor(() => expect(fetch.mock.calls.length).toBe(fetchCallsBefore + 1));
    });

    it('alerts and keeps the form open when submit fails', async () => {
        const submit = jest.fn().mockResolvedValue({ success: false, error: 'server said no' });
        const { result } = await renderLoaded(jest.fn().mockResolvedValue(LOADED), submit);

        await act(async () => {
            result.current.openAdd();
            result.current.updateField('name', 'Valid');
        });
        await act(async () => {
            await result.current.save();
        });

        expect(alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'server said no' });
        expect(result.current.showForm).toBe(true);
    });

    it('marks the list as errored when fetch fails', async () => {
        const { result } = await renderLoaded(jest.fn().mockResolvedValue({ success: false, error: 'boom' }));

        await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it('loads the details by id and fills the form on edit', async () => {
        const { result } = await renderLoaded(jest.fn().mockResolvedValue(LOADED));
        const target = result.current.entities[0];

        await act(async () => {
            await result.current.openEdit(target);
        });

        expect(load).toHaveBeenCalledWith('1');
        expect(result.current.showForm).toBe(true);
        expect(result.current.form).toEqual({ id: DETAILS.id, name: DETAILS.name, activationWord: DETAILS.activationWord });
    });

    it('alerts and keeps the form closed when the details cannot be loaded', async () => {
        load = jest.fn().mockResolvedValue({ success: false, error: 'thing with id 1 not found' });
        const { result } = await renderLoaded(jest.fn().mockResolvedValue(LOADED));

        await act(async () => {
            await result.current.openEdit(result.current.entities[0]);
        });

        expect(alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'thing with id 1 not found' });
        expect(result.current.showForm).toBe(false);
    });

    it('reloads the list after a successful erase', async () => {
        const fetch = jest.fn().mockResolvedValue(LOADED);
        const { result } = await renderLoaded(fetch);
        const target = result.current.entities[0];
        const fetchCallsBefore = fetch.mock.calls.length;

        await act(async () => {
            await result.current.eraseEntity(target);
        });

        await waitFor(() => expect(fetch.mock.calls.length).toBe(fetchCallsBefore + 1));
    });

    it('alerts when erase fails and does not reload', async () => {
        const fetch = jest.fn().mockResolvedValue(LOADED);
        const erase = jest.fn().mockResolvedValue({ success: false, error: 'denied' });
        const { result } = await renderLoaded(fetch, undefined, erase);
        const target = result.current.entities[0];

        await act(async () => {
            await result.current.eraseEntity(target);
        });

        expect(alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'denied' });
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
