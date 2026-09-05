import { IGetConnectionsController, IGetModelsFromProviderController } from '@domain/controllers';
import { Model } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { loadConnections } from './loadConnections';

export async function loadModels (
    getConnections: IGetConnectionsController,
    getModelsFromProvider: IGetModelsFromProviderController,
    setModels: Dispatch<SetStateAction<Model[]>>
) {
    try {
        const connections = await loadConnections(getConnections);
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

        setModels(allModels);
    } catch (error) {
        console.error('Failed to load models:', error);
    }
}
