import { useState } from 'react';
import { Connection } from '@domain/entities';
import { eraseConnectionController } from '@infra/container';

export function useConnectionActions (loadConnections: () => Promise<void>) {
    const [showForm, setShowForm] = useState(false);
    const [editingConnection, setEditingConnection] = useState<Connection | null>(null);

    const handleDelete = async (connectionId: string) => {
        try {
            const ctrl = eraseConnectionController();
            await ctrl.handle(connectionId);
            await loadConnections();
        } catch (error) {
            console.error('Failed to delete connection:', error);
        }
    };

    const handleEdit = (connection: Connection) => {
        setEditingConnection(connection);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingConnection(null);
    };

    const handleAdd = () => {
        setEditingConnection(null);
        setShowForm(true);
    };

    return {
        showForm,
        editingConnection,
        handleDelete,
        handleEdit,
        handleAdd,
        handleFormClose,
    };
}
