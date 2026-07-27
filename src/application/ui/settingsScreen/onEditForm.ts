import { Dispatch, SetStateAction } from 'react';
import { Connection } from '@domain/entities';
import { ConnectionFormData } from './constants';

export function onEditForm (
    connection: Connection,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setConnectionFormData: Dispatch<SetStateAction<ConnectionFormData>>
) {
    setConnectionFormData({
        name: connection.name,
        ip: connection.ip,
        port: connection.port?.toString() || '',
        auth: connection.auth || '',
        id: connection.id,
        createdAt: connection.createdAt,
        updatedAt: connection.updatedAt,
    });
    setShowForm(true);
}
