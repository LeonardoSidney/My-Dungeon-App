export function getSaveLabel (isSaving: boolean, hasUnsavedChanges: boolean): string {
    if (isSaving) {
        return 'Saving...';
    }
    if (hasUnsavedChanges) {
        return 'Save';
    }
    return 'Saved ✓';
}
