import React, { useCallback, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Status } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, useEntityScreenLoad } from '@application/ui/components';
import { useControllers } from '@adapters/ui/ControllersProvider';
import { loadStatuses } from './loadStatuses';
import { setInitialStatusState } from './setInitialStatusState';
import { handleStatusFormChange } from './handleStatusFormChange';
import { onAddNewStatus } from './onAddNewStatus';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseStatus } from './onEraseStatus';
import { onSaveStatus } from './onSaveStatus';
import { FormErrors, StatusFormData, statusFormConfig } from './constants';

export function StatusesScreen () {
  const { getStatuses, createStatus, editStatus, eraseStatus } = useControllers();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [statusStateFormData, setStatusFormData] = useState<StatusFormData>(setInitialStatusState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const loadEntities = useCallback(() => loadStatuses(getStatuses, setStatuses), [getStatuses, setStatuses]);

  useEntityScreenLoad(loadEntities);

  const handleFormSave = async () => {
    const errors: FormErrors = {};
    if (!statusStateFormData.name.trim()) errors.name = 'Name is required';
    if (!statusStateFormData.activationWord.trim()) errors.activationWord = 'Activation Word is required';
    if (!statusStateFormData.prompt.trim()) errors.prompt = 'Prompt is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    await onSaveStatus(statusStateFormData, createStatus, editStatus, getStatuses, setStatusFormData, setShowForm, setStatuses);
  };

  const handleFormChange = (field: keyof StatusFormData, value: string) => {
    setFormErrors(prev => {
      const next = { ...prev };
      const errorField = field as keyof FormErrors;
      if (next[errorField]) {
        delete next[errorField];
      }
      return next;
    });
    handleStatusFormChange(setStatusFormData)(field, value);
  };

  const handleAddNewStatus = () => {
    setFormErrors({});
    onAddNewStatus(setShowForm, setStatusFormData);
  };

  const handleEditStatus = (status: Status) => {
    setFormErrors({});
    onEditForm(status, setShowForm, setStatusFormData);
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Statuses</Text>
        </View>

        <CrudEntityList
          items={statuses}
          emptyText="No statuses found."
          getDetailText={(status) => status.activationWord}
          onEdit={handleEditStatus}
          onDelete={(status) => onEraseStatus(status, eraseStatus, getStatuses, setStatuses)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewStatus}
        >
          <Text style={styles.addButtonText}>Add Status</Text>
        </TouchableOpacity>

        <ActivationPromptForm
          showForm={showForm}
          formData={statusStateFormData}
          config={statusFormConfig}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setStatusFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}
