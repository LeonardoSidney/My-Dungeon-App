import { useCallback, useRef, useState } from 'react';
import { IAlertController } from '@domain/controllers';
import { useEntityList } from './useEntityList';

export type ControllerResponse = {
    success: boolean;
    error?: string;
};

export type EntityFormErrors<Form> = Partial<Record<keyof Form, string>>;

export type UseEntityScreenParams<Entity extends { id: string; }, Form> = {
    fetch: () => Promise<Entity[]>;
    submit: (form: Form) => Promise<ControllerResponse>;
    erase: (id: string) => Promise<ControllerResponse>;
    toFormState: (entity: Entity) => Form;
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
    showForm: boolean;
    openAdd: () => void;
    openEdit: (entity: Entity) => void;
    closeForm: () => void;
    formErrors: EntityFormErrors<Form>;
    save: () => Promise<void>;
    eraseEntity: (entity: Entity) => Promise<void>;
};

export function useEntityScreen<Entity extends { id: string; }, Form> (
    params: UseEntityScreenParams<Entity, Form>
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

    const updateField = useCallback(<K extends keyof Form> (field: K, value: Form[K]): void => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setFormErrors((prev) => {
            if (!prev[field]) {
                return prev;
            }
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const openAdd = useCallback((): void => {
        setForm(paramsRef.current.initialForm());
        setFormErrors({});
        setShowForm(true);
    }, []);

    const openEdit = useCallback((entity: Entity): void => {
        setForm(paramsRef.current.toFormState(entity));
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
            paramsRef.current.alert.handle({ title: 'Erro', message: response.error ?? `Failed to save ${paramsRef.current.entityName}` });
            return;
        }

        setForm(paramsRef.current.initialForm());
        setShowForm(false);
        await reload();
    }, [form, reload]);

    const eraseEntity = useCallback(async (entity: Entity): Promise<void> => {
        const response = await paramsRef.current.erase(entity.id);
        if (!response.success) {
            paramsRef.current.alert.handle({ title: 'Erro', message: response.error ?? `Failed to erase ${paramsRef.current.entityName}` });
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
        showForm,
        openAdd,
        openEdit,
        closeForm,
        formErrors,
        save,
        eraseEntity,
    };
}
