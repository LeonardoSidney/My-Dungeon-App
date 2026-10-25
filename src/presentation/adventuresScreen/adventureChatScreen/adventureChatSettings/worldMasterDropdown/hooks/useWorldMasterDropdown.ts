import { useDropdownVisibility } from './useDropdownVisibility';
import { useAddWorldMaster } from './useAddWorldMaster';
import { useSelectWorldMaster } from './useSelectWorldMaster';
import { UseWorldMasterDropdownParams } from './constants';

export function useWorldMasterDropdown ({
    adventureId,
    worldMasterId,
    onWorldMasterChange,
    getWorldMasters,
    setAdventureWorldMaster,
    alert
}: UseWorldMasterDropdownParams) {
    const {
        showList,
        isAdding,
        allWorldMasters,
        toggleList,
        closeList,
        startAdding,
        setWorldMasters
    } = useDropdownVisibility();

    const { handleAddWorldMaster } = useAddWorldMaster({
        adventureWorldMasterId: worldMasterId,
        setWorldMasters,
        startAdding,
        getWorldMasters
    });

    const { handleWorldMasterSelect } = useSelectWorldMaster({
        adventureId,
        onWorldMasterChange,
        closeList,
        setAdventureWorldMaster,
        alert
    });

    return {
        showList,
        isAdding,
        allWorldMasters,
        toggleList,
        handleAddWorldMaster,
        handleWorldMasterSelect
    };
}
