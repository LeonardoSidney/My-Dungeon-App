import { WorldMasterFormData, setInitialWorldMasterState } from './constants';

export function onCancelForm (
    setShowForm: (show: boolean) => void,
    setWorldMasterFormData: (updater: WorldMasterFormData) => void
) {
    setShowForm(false);
    setWorldMasterFormData(setInitialWorldMasterState());
}
