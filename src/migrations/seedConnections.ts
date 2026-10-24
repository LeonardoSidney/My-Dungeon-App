import {
    createConnectionConfigController,
    editConnectionController,
    getConnectionsController,
    getModelsFromProviderController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { ConnectionListItem } from '@domain/controllers';
import { Model } from '@domain/entities';
import { SeedAssistant, SeedConnection } from './types';
import { MODEL_ID_PLACEHOLDER, listItems } from './shared';

type FetchConnectionModelsReturn = {
    success: boolean;
    models?: Model[];
    error?: string;
};

type ResolveActiveConnectionReturn = {
    success: boolean;
    connection?: ConnectionListItem;
    models?: Model[];
    error?: string;
};

type SeedConnectionsReturn = {
    success: boolean;
    connections?: ConnectionListItem[];
    error?: string;
};

export async function fetchConnectionModels (connection: ConnectionListItem): Promise<FetchConnectionModelsReturn> {
    const getModels = getModelsFromProviderController();
    const response = await getModels.handle({ connectionId: connection.id });
    if (!response.success) {
        return { success: false, error: response.error };
    }

    if (!response.models) {
        return { success: true, models: [] };
    }

    const loadedModels = response.models.filter(model => model.loaded === true);
    const unloadedCount = response.models.length - loadedModels.length;
    if (unloadedCount > 0) {
        logger.debug(`Migration: connection "${connection.name}" reports ${unloadedCount} unloaded model(s), filtered out`);
    }

    return { success: true, models: loadedModels };
}

export async function resolveActiveConnection (
    connections: ConnectionListItem[],
    assistantSeeds: SeedAssistant[]
): Promise<ResolveActiveConnectionReturn> {
    for (const connection of connections) {
        const modelsResponse = await fetchConnectionModels(connection);
        if (!modelsResponse.success || !modelsResponse.models) {
            logger.warning(`Migration: connection "${connection.name}" unreachable: ${modelsResponse.error ?? 'unknown error'}`);
            continue;
        }

        const models = modelsResponse.models;

        const hasModel = models.length > 0;
        if (!hasModel) {
            logger.warning(`Migration: connection "${connection.name}" has no loaded models`);
            continue;
        }

        const missingModelIds: string[] = [];
        for (const seed of assistantSeeds) {
            if (seed.modelId === MODEL_ID_PLACEHOLDER) {
                continue;
            }

            const modelExists = models.some(model => model.id === seed.modelId);
            if (!modelExists) {
                missingModelIds.push(seed.modelId);
            }
        }

        if (missingModelIds.length > 0) {
            logger.warning(`Migration: connection "${connection.name}" does not serve model(s) ${missingModelIds.join(', ')}`);
            continue;
        }

        logger.info(`Migration: active connection resolved - "${connection.name}" with ${models.length} model(s)`);
        return { success: true, connection, models };
    }

    return { success: false, error: 'Migration: no valid connection found - assistants require a connection serving their models' };
}

export async function seedConnections (seeds: SeedConnection[]): Promise<SeedConnectionsReturn> {
    const createConnection = createConnectionConfigController();
    const editConnection = editConnectionController();
    const getConnections = getConnectionsController();
    const existingResponse = listItems(await getConnections.handle(), 'connections');
    if (!existingResponse.success || !existingResponse.items) {
        return { success: false, error: existingResponse.error };
    }

    const existing = existingResponse.items;
    const connectionsByName = new Map<string, ConnectionListItem>(existing.map(connection => [connection.name, connection]));
    logger.info(`Migration: seeding connections (${seeds.length} seed(s))`);

    for (const seed of seeds) {
        const current = connectionsByName.get(seed.name);
        if (!current) {
            const response = await createConnection.handle(seed);
            if (!response.success || !response.id) {
                return { success: false, error: `Migration: failed to create connection "${seed.name}": ${response.error}` };
            }
            connectionsByName.set(seed.name, { id: response.id, name: seed.name, ip: seed.ip, port: seed.port });
            continue;
        }

        const response = await editConnection.handle({
            id: current.id,
            editParams: {
                name: seed.name,
                ip: seed.ip,
                port: seed.port,
                auth: seed.auth,
            },
        });
        if (!response.success) {
            return { success: false, error: `Migration: failed to restore connection "${seed.name}": ${response.error}` };
        }
        connectionsByName.set(seed.name, { id: current.id, name: seed.name, ip: seed.ip, port: seed.port });
    }

    return { success: true, connections: Array.from(connectionsByName.values()) };
}
