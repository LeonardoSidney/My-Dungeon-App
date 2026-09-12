import { IGetConnectionsController, IGetModelsFromProviderController } from '@domain/controllers';
import { Model } from '@domain/entities';

export async function loadModels (
    getConnections: IGetConnectionsController,
    getModelsFromProvider: IGetModelsFromProviderController
): Promise<Model[]> {
    const connections = await getConnections.handle();
    const allModels: Model[] = [];

    for (const connection of connections) {
        try {
            const result = await getModelsFromProvider.handle({ connection });
            if (result.models && result.models.length > 0) {
                allModels.push(...result.models);
            }
        } catch (error) {
            console.error(`Failed to load models from connection ${connection.id}:`, error);
        }
    }

    return allModels;
}
