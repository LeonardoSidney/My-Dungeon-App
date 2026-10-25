import { useCallback, useState } from 'react';
import {
    AdventureChatWorldMaster,
    IAlertController,
    IGetWorldMastersController,
    ISetAdventureWorldMasterController,
} from '@domain/controllers';
import { showError } from '@presentation/utils/showError';

type UseWorldMasterPickerParams = {
    adventureId: string;
    currentWorldMasterId?: string;
    onChange: () => Promise<void>;
    getWorldMasters: IGetWorldMastersController;
    setAdventureWorldMaster: ISetAdventureWorldMasterController;
    alert: IAlertController;
};

export function useWorldMasterPicker ({
    adventureId,
    currentWorldMasterId,
    onChange,
    getWorldMasters,
    setAdventureWorldMaster,
    alert,
}: UseWorldMasterPickerParams) {
    const [isOpen, setIsOpen] = useState(false);
    const [candidates, setCandidates] = useState<AdventureChatWorldMaster[] | null>(null);

    const toggle = useCallback(() => setIsOpen(open => !open), []);

    const loadCandidates = useCallback(async () => {
        const response = await getWorldMasters.handle();
        if (!response.success || !response.items) {
            showError(alert, response.error, 'Failed to load world masters');
            return;
        }
        setCandidates(response.items
            .filter(worldMaster => worldMaster.id !== currentWorldMasterId)
            .map(worldMaster => ({ id: worldMaster.id, name: worldMaster.name })));
    }, [currentWorldMasterId, getWorldMasters, alert]);

    const select = useCallback(async (worldMaster: AdventureChatWorldMaster) => {
        const response = await setAdventureWorldMaster.handle({ adventureId, worldMasterId: worldMaster.id });
        if (!response.success) {
            showError(alert, response.error, 'Failed to update world master');
            return;
        }
        setIsOpen(false);
        setCandidates(null);
        await onChange();
    }, [adventureId, onChange, setAdventureWorldMaster, alert]);

    return { isOpen, candidates, toggle, loadCandidates, select };
}
