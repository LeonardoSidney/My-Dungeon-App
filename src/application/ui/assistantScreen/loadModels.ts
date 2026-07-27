import { getModelsFromProviderController } from '@infra/container';
import { Dispatch, SetStateAction } from 'react';
import { Model } from '@domain/entities';
import { loadConnections } from './loadConnections';

export async function loadModels (
    setModels: Dispatch<SetStateAction<Model[]>>
) {
    try {
        const connections = await loadConnections();

        const modelsCtrl = getModelsFromProviderController();
        const allModels: Model[] = [];

        for (const connection of connections) {
            try {
                const result = await modelsCtrl.handle({ connection });
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
