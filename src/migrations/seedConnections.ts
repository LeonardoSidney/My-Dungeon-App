import {
    createConnectionConfigController,
    editConnectionController,
    getConnectionsController,
    getModelsFromProviderController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import { Connection, Model } from '@domain/entities';
import { SeedAssistant, SeedConnection } from './types';
import { MODEL_ID_PLACEHOLDER } from './shared';

export async function fetchConnectionModels (connection: Connection): Promise<Model[]> {
    const getModels = getModelsFromProviderController();
    const response = await getModels.handle({ connection });
    if (!response.success || !response.models) {
        return [];
    }

    const loadedModels = response.models.filter(model => model.loaded === true);
    const unloadedCount = response.models.length - loadedModels.length;
    if (unloadedCount > 0) {
        logger.debug(`Migration: connection "${connection.name}" reports ${unloadedCount} unloaded model(s), filtered out`);
    }

    return loadedModels;
}

export async function resolveActiveConnection (
    connections: Connection[],
    assistantSeeds: SeedAssistant[]
): Promise<{ connection: Connection; models: Model[]; }> {
    for (const connection of connections) {
        let models: Model[];
        try {
            models = await fetchConnectionModels(connection);
        } catch (error) {
            const reason = error instanceof Error ? error.message : 'unknown error';
            logger.warning(`Migration: connection "${connection.name}" unreachable: ${reason}`);
            continue;
        }

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
        return { connection, models };
    }

    throw new Error('Migration: no valid connection found - assistants require a connection serving their models');
}

export async function seedConnections (seeds: SeedConnection[]): Promise<Connection[]> {
    const createConnection = createConnectionConfigController();
    const editConnection = editConnectionController();
    const getConnections = getConnectionsController();
    const existing = await getConnections.handle();
    const connectionsByName = new Map<string, Connection>(existing.map(connection => [connection.name, connection]));
    logger.info(`Migration: seeding connections (${seeds.length} seed(s))`);

    for (const seed of seeds) {
        const current = connectionsByName.get(seed.name);
        if (!current) {
            const response = await createConnection.handle(seed);
            if (!response.success || !response.connection) {
                throw new Error(`Migration: failed to create connection "${seed.name}": ${response.error}`);
            }
            connectionsByName.set(response.connection.name, response.connection);
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
        if (!response.success || !response.connection) {
            throw new Error(`Migration: failed to restore connection "${seed.name}": ${response.error}`);
        }
        connectionsByName.set(response.connection.name, response.connection);
    }

    return Array.from(connectionsByName.values());
}
