import { WorldMasterFormData, setInitialWorldMasterState } from './constants';

export function onAddNewWorldMaster (
    setShowForm: (show: boolean) => void,
    setWorldMasterFormData: (updater: WorldMasterFormData) => void
) {
    setWorldMasterFormData(setInitialWorldMasterState());
    setShowForm(true);
}
