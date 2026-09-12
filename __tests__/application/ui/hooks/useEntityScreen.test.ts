import { Alert } from 'react-native';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useEntityScreen, type EntityFormErrors, type UseEntityScreenParams } from '@application/ui/hooks';

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

const LOADED: TestEntity[] = [{ id: '1', name: 'A', activationWord: 'w' }];

function buildParams (fetch: jest.Mock, submit?: jest.Mock, erase?: jest.Mock): UseEntityScreenParams<TestEntity, TestForm> {
    return {
        fetch,
        submit: submit ?? jest.fn().mockResolvedValue({ success: true }),
        erase: erase ?? jest.fn().mockResolvedValue({ success: true }),
        toFormState: (entity) => ({ id: entity.id, name: entity.name, activationWord: entity.activationWord }),
        initialForm: () => ({ id: '', name: '', activationWord: '' }),
        validate: (form) => {
            const errors: EntityFormErrors<TestForm> = {};
            if (!form.name) {
                errors.name = 'Name is required';
            }
            return errors;
        },
        entityName: 'thing',
    };
}

async function renderLoaded (fetch: jest.Mock, submit?: jest.Mock, erase?: jest.Mock) {
    const params = buildParams(fetch, submit, erase);
    const view = await renderHook(() => useEntityScreen<TestEntity, TestForm>(params));
    await waitFor(() => expect(view.result.current.isLoading).toBe(false));
    return view;
}

describe('useEntityScreen', () => {
    it('loads entities on mount and clears the loading flag', async () => {
        const fetch = jest.fn().mockResolvedValue(LOADED);
        const { result } = await renderLoaded(fetch);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result.current.entities).toHaveLength(1);
        expect(result.current.isError).toBe(false);
    });

    it('marks the list as errored when fetch fails and recovers on reload', async () => {
        const fetch = jest.fn()
            .mockRejectedValueOnce(new Error('boom'))
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
        const alertSpy = jest.spyOn(Alert, 'alert');

        await act(async () => {
            result.current.openAdd();
            result.current.updateField('name', 'Valid');
        });
        await act(async () => {
            await result.current.save();
        });

        expect(alertSpy).toHaveBeenCalledWith('Erro', 'server said no');
        expect(result.current.showForm).toBe(true);
        alertSpy.mockRestore();
    });

    it('fills the form from the entity and opens it on edit', async () => {
        const { result } = await renderLoaded(jest.fn().mockResolvedValue(LOADED));
        const target = result.current.entities[0];

        await act(async () => {
            result.current.openEdit(target);
        });

        expect(result.current.showForm).toBe(true);
        expect(result.current.form).toEqual({ id: target.id, name: target.name, activationWord: target.activationWord });
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
        const alertSpy = jest.spyOn(Alert, 'alert');

        await act(async () => {
            await result.current.eraseEntity(target);
        });

        expect(alertSpy).toHaveBeenCalledWith('Erro', 'denied');
        expect(fetch).toHaveBeenCalledTimes(1);
        alertSpy.mockRestore();
    });
});
