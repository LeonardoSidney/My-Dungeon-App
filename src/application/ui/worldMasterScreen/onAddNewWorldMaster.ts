import { WorldMasterFormData } from './constants';
import { setInitialWorldMasterState } from './setInitialWorldMasterState';

export function onAddNewWorldMaster (
    setShowForm: (show: boolean) => void,
    setWorldMasterFormData: (updater: WorldMasterFormData) => void
) {
    setWorldMasterFormData(setInitialWorldMasterState());
    setShowForm(true);
}
