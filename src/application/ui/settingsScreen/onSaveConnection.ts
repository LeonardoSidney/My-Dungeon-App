import { Dispatch, SetStateAction } from 'react';
import { Connection } from '@domain/entities';
import { ConnectionFormData } from './constants';
import { loadConnections } from './loadConnections';
import { onSubmit } from './connectionForm/onSubmit';
import { setInitialConnectionState } from './constants';

export async function onSaveConnection (
    formData: ConnectionFormData,
    setConnectionFormData: Dispatch<SetStateAction<ConnectionFormData>>,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setConnections: Dispatch<SetStateAction<Connection[]>>
) {
    const getPortNumber = () => {
        const portNumber = parseInt(formData.port, 10);
        if (isNaN(portNumber)) return undefined;
        return portNumber;
    };

    try {
        await onSubmit(formData, getPortNumber);
        setConnectionFormData(setInitialConnectionState());
        setShowForm(false);
        await loadConnections(setConnections);
    } catch (error) {
        console.error('Failed to save connection:', error);
    }
}
