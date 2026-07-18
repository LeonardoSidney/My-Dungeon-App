import { Connection } from '@domain/entities';
import { createConnectionConfigController, editConnectionController } from '@infra/container';

type FormState = {
    name: string;
    ip: string;
    port: string;
    auth: string;
};

type UseConnectionSaveReturn = {
    saveConnection: (
        formState: FormState,
        getPortNumber: () => number | undefined,
        initialData: Connection | null,
        onClose: () => void,
        onSave: () => void,
        setLoading: (loading: boolean) => void,
    ) => Promise<void>;
};

const saveEditedConnection = async (
    formState: FormState,
    portNumber: number | undefined,
    initialData: Connection,
) => {
    await editConnectionController().handle({
        id: initialData.id,
        name: formState.name.trim(),
        ip: formState.ip.trim(),
        port: portNumber,
        auth: formState.auth.trim() || undefined,
        createdAt: initialData.createdAt,
    });
};

const saveNewConnection = async (
    formState: FormState,
    portNumber: number | undefined,
) => {
    await createConnectionConfigController().handle({
        name: formState.name.trim(),
        ip: formState.ip.trim(),
        port: portNumber,
        auth: formState.auth.trim() || undefined,
    });
};

export function useConnectionSave (): UseConnectionSaveReturn {
    const saveConnection = async (
        formState: FormState,
        getPortNumber: () => number | undefined,
        initialData: Connection | null,
        onClose: () => void,
        onSave: () => void,
        setLoading: (loading: boolean) => void,
    ) => {
        setLoading(true);
        try {
            const portNumber = getPortNumber();
            const shouldEdit = !!initialData?.id;

            if (!shouldEdit) {
                await saveNewConnection(formState, portNumber);
            } else {
                await saveEditedConnection(formState, portNumber, initialData);
            }

            onSave();
            onClose();
        } catch (error) {
            console.error('Failed to save connection:', error);
        } finally {
            setLoading(false);
        }
    };

    return { saveConnection };
}
