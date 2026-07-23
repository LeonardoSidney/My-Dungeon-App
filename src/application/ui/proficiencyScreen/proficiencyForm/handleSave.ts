import { ProficiencyFormProps } from './constants';
import { setInitialProficiencyState } from '../setInitialProficiencyState';
import { loadProficiencies } from '../loadProficiencies';

export async function handleSave (params: ProficiencyFormProps) {
    await params.onSave();
    params.setProficiencyFormData(setInitialProficiencyState());
    params.setShowForm(false);
    await loadProficiencies(params.setProficiencies);
}
