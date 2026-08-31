import { Alert } from 'react-native';
import { Connection } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { eraseConnectionController } from '@infra/container';
import { loadConnections } from './loadConnections';

export async function onDeleteConnection (
    connectionId: string,
    setConnections: Dispatch<SetStateAction<Connection[]>>
) {
    const ctrl = eraseConnectionController();
    const response = await ctrl.handle(connectionId);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to delete connection');
        return;
    }
    await loadConnections(setConnections);
}
