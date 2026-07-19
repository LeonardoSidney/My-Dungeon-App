import { useEffect, useState } from 'react';
import { Assistant, Model, Sampler } from '@domain/entities';
import {
    createAssistantController,
    editAssistantController,
    eraseAssistantController,
    getAssistantsController,
    getConnectionsController,
    getModelsFromProviderController,
    getSamplersController
} from '@infra/container';

export function useAssistantScreenLogic () {
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    const [models, setModels] = useState<Model[]>([]);
    const [samplers, setSamplers] = useState<Sampler[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [selectedSampler, setSelectedSampler] = useState<Sampler | null>(null);

    const loadAssistants = async () => {
        setLoading(true);
        try {
            const ctrl = getAssistantsController();
            const result = await ctrl.handle();
            setAssistants(result);
        } catch (error) {
            console.error('Failed to load assistants:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadModels = async () => {
        try {
            const connectionsCtrl = getConnectionsController();
            const connections = await connectionsCtrl.handle();

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
    };

    const loadSamplers = async () => {
        try {
            const ctrl = getSamplersController();
            const result = await ctrl.handle();
            setSamplers(result);
        } catch (error) {
            console.error('Failed to load samplers:', error);
        }
    };

    useEffect(() => {
        loadAssistants();
        loadModels();
        loadSamplers();
    }, []);

    const handleDelete = async (assistantId: string) => {
        try {
            const ctrl = eraseAssistantController();
            await ctrl.handle(assistantId);
            await loadAssistants();
        } catch (error) {
            console.error('Failed to delete assistant:', error);
        }
    };

    const handleEdit = (assistant: Assistant) => {
        const currentModel = models.find(
            (m) => m.id === assistant.model.id && m.connection.id === assistant.model.connection.id
        ) ?? null;
        const currentSampler = samplers.find((s) => s.id === assistant.sampler.id) ?? null;
        setEditingAssistant(assistant);
        setSelectedModel(currentModel);
        setSelectedSampler(currentSampler);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingAssistant(null);
        setSelectedModel(null);
        setSelectedSampler(null);
    };

    const handleAdd = () => {
        setEditingAssistant(null);
        setSelectedModel(null);
        setSelectedSampler(null);
        setShowForm(true);
    };

    const handleFormSave = async (assistantData: {
        name: string;
        observation?: string;
        model: Model;
        sampler: Sampler;
    }) => {
        if (editingAssistant) {
            await editAssistantController().handle({
                id: editingAssistant.id,
                name: assistantData.name,
                observation: assistantData.observation,
                model: assistantData.model,
                sampler: assistantData.sampler,
                createdAt: editingAssistant.createdAt,
            });
        }

        if (!editingAssistant) {
            await createAssistantController().handle({
                name: assistantData.name,
                observation: assistantData.observation,
                model: assistantData.model,
                sampler: assistantData.sampler,
            });
        }

        await loadAssistants();
        handleFormClose();
    };

    return {
        assistants,
        models,
        samplers,
        loading,
        showForm,
        editingAssistant,
        selectedModel,
        setSelectedModel,
        selectedSampler,
        setSelectedSampler,
        loadAssistants,
        handleDelete,
        handleEdit,
        handleFormClose,
        handleAdd,
        handleFormSave,
    };
}
