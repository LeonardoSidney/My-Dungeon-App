import { useEffect, useState } from 'react';
import { World } from '@domain/entities';
import { createWorldController, editWorldController, eraseWorldController, getWorldsController } from '@infra/container';

export function useWorldScreenLogic () {
    const [worlds, setWorlds] = useState<World[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingWorld, setEditingWorld] = useState<World | null>(null);

    const loadWorlds = async () => {
        setLoading(true);
        try {
            const ctrl = getWorldsController();
            const result = await ctrl.handle();
            setWorlds(result);
        } catch (error) {
            console.error('Failed to load worlds:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWorlds();
    }, []);

    const handleDelete = async (worldId: string) => {
        try {
            const ctrl = eraseWorldController();
            await ctrl.handle(worldId);
            await loadWorlds();
        } catch (error) {
            console.error('Failed to delete world:', error);
        }
    };

    const handleEdit = (world: World) => {
        setEditingWorld(world);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingWorld(null);
    };

    const handleAdd = () => {
        setEditingWorld(null);
        setShowForm(true);
    };

    const handleFormSave = async (worldData: {
        name: string;
        activationWord: string;
        prompt: string;
        observation?: string;
    }) => {
        if (editingWorld) {
            await editWorldController().handle({
                id: editingWorld.id,
                name: worldData.name,
                activationWord: worldData.activationWord,
                prompt: worldData.prompt,
                observation: worldData.observation,
                createdAt: editingWorld.createdAt,
            });
        }

        if (!editingWorld) {
            await createWorldController().handle({
                name: worldData.name,
                activationWord: worldData.activationWord,
                prompt: worldData.prompt,
                observation: worldData.observation,
            });
        }

        await loadWorlds();
        handleFormClose();
    };

    return {
        worlds,
        loading,
        showForm,
        editingWorld,
        loadWorlds,
        handleDelete,
        handleEdit,
        handleFormClose,
        handleAdd,
        handleFormSave,
    };
}
