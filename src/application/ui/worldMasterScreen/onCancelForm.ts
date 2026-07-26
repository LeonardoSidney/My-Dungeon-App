import { WorldMasterFormData } from './constants';
import { setInitialWorldMasterState } from './setInitialWorldMasterState';

export function onCancelForm (
    setShowForm: (show: boolean) => void,
    setWorldMasterFormData: (updater: WorldMasterFormData) => void
) {
    setShowForm(false);
    setWorldMasterFormData(setInitialWorldMasterState());
}
