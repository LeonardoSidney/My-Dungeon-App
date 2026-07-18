import { useEffect, useState } from 'react';
import { Connection } from '@domain/entities';
import { getConnectionsController } from '@infra/container';

export function useConnectionPanel () {
    const [expanded, setExpanded] = useState(false);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(false);

    const loadConnections = async () => {
        setLoading(true);
        try {
            const ctrl = getConnectionsController();
            const result = await ctrl.handle();
            setConnections(result);
        } catch (error) {
            console.error('Failed to load connections:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (expanded) {
            loadConnections();
        }
    }, [expanded]);

    return {
        expanded,
        setExpanded,
        connections,
        loading,
        loadConnections,
    };
}
