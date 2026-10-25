import { useCallback, useRef, useState } from 'react';
import { DetailControllerResponse, IAlertController, ListControllerResponse } from '@domain/controllers';
import { showError } from '../utils/showError';
import { useEntityList } from './useEntityList';

export type ControllerResponse = {
    success: boolean;
    error?: string;
};

export type EntityFormErrors<Form> = Partial<Record<keyof Form, string>>;

export type UseEntityScreenParams<Entity extends { id: string; }, Form, Details = Entity> = {
    fetch: () => Promise<ListControllerResponse<Entity>>;
    load: (id: string) => Promise<DetailControllerResponse<Details>>;
    submit: (form: Form) => Promise<ControllerResponse>;
    erase: (id: string) => Promise<ControllerResponse>;
    toFormState: (details: Details) => Form;
    initialForm: () => Form;
    validate: (form: Form) => EntityFormErrors<Form>;
    entityName: string;
    alert: IAlertController;
};

export type UseEntityScreenReturn<Entity extends { id: string; }, Form> = {
    entities: Entity[];
    isLoading: boolean;
    isError: boolean;
    reload: () => Promise<void>;
    form: Form;
    updateField: <K extends keyof Form>(field: K, value: Form[K]) => void;
    updateFields: (changes: Partial<Form>) => void;
    showForm: boolean;
    openAdd: () => void;
    openEdit: (entity: Entity) => Promise<void>;
    closeForm: () => void;
    formErrors: EntityFormErrors<Form>;
    save: () => Promise<void>;
    eraseEntity: (entity: Entity) => Promise<void>;
};

export function useEntityScreen<Entity extends { id: string; }, Form, Details = Entity> (
    params: UseEntityScreenParams<Entity, Form, Details>
): UseEntityScreenReturn<Entity, Form> {
    const paramsRef = useRef(params);
    paramsRef.current = params;

    const {
        items: entities,
        isLoading,
        isError,
        reload,
    } = useEntityList({ fetch: () => paramsRef.current.fetch() });

    const [form, setForm] = useState<Form>(params.initialForm);
    const [showForm, setShowForm] = useState(false);
    const [formErrors, setFormErrors] = useState<EntityFormErrors<Form>>({});

    const updateFields = useCallback((changes: Partial<Form>): void => {
        setForm((prev) => ({ ...prev, ...changes }));
        setFormErrors((prev) => {
            const clearedFields = (Object.keys(changes) as (keyof Form)[]).filter(field => prev[field]);
            if (clearedFields.length === 0) {
                return prev;
            }
            const next = { ...prev };
            clearedFields.forEach(field => delete next[field]);
            return next;
        });
    }, []);

    const updateField = useCallback(<K extends keyof Form> (field: K, value: Form[K]): void => {
        updateFields({ [field]: value } as unknown as Partial<Form>);
    }, [updateFields]);

    const openAdd = useCallback((): void => {
        setForm(paramsRef.current.initialForm());
        setFormErrors({});
        setShowForm(true);
    }, []);

    const openEdit = useCallback(async (entity: Entity): Promise<void> => {
        const response = await paramsRef.current.load(entity.id);
        if (!response.success || !response.data) {
            showError(paramsRef.current.alert, response.error, `Failed to load ${paramsRef.current.entityName}`);
            return;
        }
        setForm(paramsRef.current.toFormState(response.data));
        setFormErrors({});
        setShowForm(true);
    }, []);

    const closeForm = useCallback((): void => {
        setForm(paramsRef.current.initialForm());
        setFormErrors({});
        setShowForm(false);
    }, []);

    const save = useCallback(async (): Promise<void> => {
        const errors = paramsRef.current.validate(form);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const response = await paramsRef.current.submit(form);
        if (!response.success) {
            showError(paramsRef.current.alert, response.error, `Failed to save ${paramsRef.current.entityName}`);
            return;
        }

        setForm(paramsRef.current.initialForm());
        setShowForm(false);
        await reload();
    }, [form, reload]);

    const eraseEntity = useCallback(async (entity: Entity): Promise<void> => {
        const response = await paramsRef.current.erase(entity.id);
        if (!response.success) {
            showError(paramsRef.current.alert, response.error, `Failed to erase ${paramsRef.current.entityName}`);
            return;
        }
        await reload();
    }, [reload]);

    return {
        entities,
        isLoading,
        isError,
        reload,
        form,
        updateField,
        updateFields,
        showForm,
        openAdd,
        openEdit,
        closeForm,
        formErrors,
        save,
        eraseEntity,
    };
}
