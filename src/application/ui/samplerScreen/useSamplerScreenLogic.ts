import { useEffect, useState } from 'react';
import { Sampler } from '@domain/entities';
import { createSamplerController, editSamplerController, eraseSamplerController, getSamplersController } from '@infra/container';

export function useSamplerScreenLogic () {
    const [samplers, setSamplers] = useState<Sampler[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingSampler, setEditingSampler] = useState<Sampler | null>(null);
    const [resetKey, setResetKey] = useState(0);

    const loadSamplers = async () => {
        setLoading(true);
        try {
            const ctrl = getSamplersController();
            const result = await ctrl.handle();
            setSamplers(result);
        } catch (error) {
            console.error('Failed to load samplers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSamplers();
    }, []);

    const handleDelete = async (samplerId: string) => {
        try {
            const ctrl = eraseSamplerController();
            await ctrl.handle(samplerId);
            await loadSamplers();
        } catch (error) {
            console.error('Failed to delete sampler:', error);
        }
    };

    const handleEdit = (sampler: Sampler) => {
        setEditingSampler(sampler);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingSampler(null);
    };

    const handleAdd = () => {
        setEditingSampler(null);
        setResetKey((prev) => prev + 1);
        setShowForm(true);
    };

    const handleFormSave = async (samplerData: Omit<Sampler, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingSampler) {
            await editSamplerController().handle({
                ...samplerData,
                id: editingSampler.id,
                createdAt: editingSampler.createdAt,
            });
        }

        if (!editingSampler) {
            await createSamplerController().handle(samplerData);
        }

        await loadSamplers();
        handleFormClose();
    };

    return {
        samplers,
        loading,
        showForm,
        editingSampler,
        resetKey,
        loadSamplers,
        handleDelete,
        handleEdit,
        handleFormClose,
        handleAdd,
        handleFormSave,
    };
}
