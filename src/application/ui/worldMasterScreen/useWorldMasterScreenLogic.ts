import { useEffect, useState } from 'react';
import { WorldMaster, Assistant } from '@domain/entities';
import {
    createWorldMasterController,
    editWorldMasterController,
    eraseWorldMasterController,
    getWorldMasterController,
    getAssistantsController
} from '@infra/container';

export function useWorldMasterScreenLogic () {
    const [worldMasters, setWorldMasters] = useState<WorldMaster[]>([]);
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingWorldMaster, setEditingWorldMaster] = useState<WorldMaster | null>(null);
    const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);

    const loadWorldMasters = async () => {
        setLoading(true);
        try {
            const ctrl = getWorldMasterController();
            const result = await ctrl.handle();
            setWorldMasters(result);
        } catch (error) {
            console.error('Failed to load world masters:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAssistants = async () => {
        try {
            const ctrl = getAssistantsController();
            const result = await ctrl.handle();
            setAssistants(result);
        } catch (error) {
            console.error('Failed to load assistants:', error);
        }
    };

    useEffect(() => {
        loadWorldMasters();
        loadAssistants();
    }, []);

    const handleDelete = async (worldMasterId: string) => {
        try {
            const ctrl = eraseWorldMasterController();
            await ctrl.handle(worldMasterId);
            await loadWorldMasters();
        } catch (error) {
            console.error('Failed to delete world master:', error);
        }
    };

    const handleEdit = (worldMaster: WorldMaster) => {
        const currentAssistant = assistants.find((a) => a.id === worldMaster.assistant.id) || null;
        setEditingWorldMaster(worldMaster);
        setSelectedAssistant(currentAssistant);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingWorldMaster(null);
        setSelectedAssistant(null);
    };

    const handleAdd = () => {
        setEditingWorldMaster(null);
        setSelectedAssistant(null);
        setShowForm(true);
    };

    const handleFormSave = async (worldMasterData: {
        name: string;
        activationWord: string;
        prompt: string;
        observation?: string;
        assistant: Assistant;
    }) => {
        if (editingWorldMaster) {
            await editWorldMasterController().handle({
                id: editingWorldMaster.id,
                name: worldMasterData.name,
                activationWord: worldMasterData.activationWord,
                prompt: worldMasterData.prompt,
                observation: worldMasterData.observation,
                assistant: worldMasterData.assistant,
                createdAt: editingWorldMaster.createdAt,
            });
        }

        if (!editingWorldMaster) {
            await createWorldMasterController().handle({
                name: worldMasterData.name,
                activationWord: worldMasterData.activationWord,
                prompt: worldMasterData.prompt,
                observation: worldMasterData.observation,
                assistant: worldMasterData.assistant,
            });
        }

        await loadWorldMasters();
        handleFormClose();
    };

    return {
        worldMasters,
        assistants,
        selectedAssistant,
        setSelectedAssistant,
        loading,
        showForm,
        editingWorldMaster,
        loadWorldMasters,
        handleDelete,
        handleEdit,
        handleFormClose,
        handleAdd,
        handleFormSave,
    };
}
