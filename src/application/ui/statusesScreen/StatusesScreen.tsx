import React, { useState } from 'react';
import { Text, ScrollView, TouchableOpacity, View } from 'react-native';
import { Status } from '@domain/entities';
import { styles } from './styles';
import { StatusPanel } from './statusPanel';
import { StatusForm } from './statusForm';
import { useStatusesScreenLogic } from './useStatusesScreenLogic';
import { StatusFormData, FormErrors } from './constants';
import { setInitialStatusState } from './setInitialStatusState';
import { handleStatusFormChange } from './handleStatusFormChange';
import { onAddNewStatus } from './onAddNewStatus';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseStatus } from './onEraseStatus';
import { onSaveStatus } from './onSaveStatus';

export function StatusesScreen () {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [statusStateFormData, setStatusFormData] = useState<StatusFormData>(setInitialStatusState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useStatusesScreenLogic(setStatuses);

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

    try {
      await onSaveStatus(statusStateFormData, setStatusFormData, setShowForm, setStatuses);
    } catch (error) {
      setFormErrors({ name: (error as Error).message });
    }
  };

  const handleFormChange = (field: keyof StatusFormData, value: string | Date) => {
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

        <StatusPanel
          statuses={statuses}
          onEdit={handleEditStatus}
          onDelete={(status) => onEraseStatus(status, setStatuses)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewStatus}
        >
          <Text style={styles.addButtonText}>Add Status</Text>
        </TouchableOpacity>

        <StatusForm
          showForm={showForm}
          statusStateFormData={statusStateFormData}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setStatusFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}
