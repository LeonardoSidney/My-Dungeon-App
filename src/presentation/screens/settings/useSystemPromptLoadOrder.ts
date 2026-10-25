import { useCallback, useEffect, useState } from 'react';
import {
    IAlertController,
    IGetSystemPromptLoadOrderController,
    IResetSystemPromptLoadOrderController,
    ISaveSystemPromptLoadOrderController,
} from '@domain/controllers';
import { showError } from '@presentation/utils/showError';

type UseSystemPromptLoadOrderParams = {
    getSystemPromptLoadOrder: IGetSystemPromptLoadOrderController;
    saveSystemPromptLoadOrder: ISaveSystemPromptLoadOrderController;
    resetSystemPromptLoadOrder: IResetSystemPromptLoadOrderController;
    alert: IAlertController;
};

export function useSystemPromptLoadOrder ({
    getSystemPromptLoadOrder,
    saveSystemPromptLoadOrder,
    resetSystemPromptLoadOrder,
    alert,
}: UseSystemPromptLoadOrderParams) {
    const [loadOrder, setLoadOrder] = useState('');
    const [savedLoadOrder, setSavedLoadOrder] = useState('');
    const [error, setError] = useState<string | undefined>(undefined);
    const [loadError, setLoadError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let isActive = true;

        getSystemPromptLoadOrder.handle().then(response => {
            if (!isActive) {
                return;
            }

            setIsLoading(false);
            if (!response.success || response.loadOrder === undefined) {
                setLoadError(response.error ?? 'Failed to load the system prompt load order');
                return;
            }

            setLoadOrder(response.loadOrder);
            setSavedLoadOrder(response.loadOrder);
        });

        return () => {
            isActive = false;
        };
    }, [getSystemPromptLoadOrder]);

    const changeLoadOrder = useCallback((value: string) => {
        setLoadOrder(value);
        setError(undefined);
    }, []);

    const save = useCallback(async () => {
        setIsSaving(true);
        const response = await saveSystemPromptLoadOrder.handle({ loadOrder });
        setIsSaving(false);
        if (!response.success || response.loadOrder === undefined) {
            setError(response.error ?? 'Failed to save the system prompt load order');
            return;
        }

        setLoadOrder(response.loadOrder);
        setSavedLoadOrder(response.loadOrder);
        setError(undefined);
    }, [loadOrder, saveSystemPromptLoadOrder]);

    const restoreDefault = useCallback(async () => {
        setIsSaving(true);
        const response = await resetSystemPromptLoadOrder.handle();
        setIsSaving(false);
        if (!response.success || response.loadOrder === undefined) {
            showError(alert, response.error, 'Failed to restore the default system prompt load order');
            return;
        }

        setLoadOrder(response.loadOrder);
        setSavedLoadOrder(response.loadOrder);
        setError(undefined);
    }, [resetSystemPromptLoadOrder, alert]);

    const hasUnsavedChanges = loadOrder !== savedLoadOrder;

    return { loadOrder, error, loadError, isLoading, isSaving, hasUnsavedChanges, changeLoadOrder, save, restoreDefault };
}
