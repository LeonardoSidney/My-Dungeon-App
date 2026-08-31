import { useDropdownVisibility } from './useDropdownVisibility';
import { useAddWorldMaster } from './useAddWorldMaster';
import { useSelectWorldMaster } from './useSelectWorldMaster';
import { UseWorldMasterDropdownParams } from './constants';

export function useWorldMasterDropdown ({
    adventure,
    onWorldMasterSelect
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
        adventureWorldMasterId: adventure.worldMasterId,
        setWorldMasters,
        startAdding
    });

    const { handleWorldMasterSelect } = useSelectWorldMaster({
        adventure,
        onWorldMasterSelect,
        closeList
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
